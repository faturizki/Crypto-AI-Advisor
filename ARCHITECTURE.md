# Architecture & Design Decisions

This document outlines the architectural choices and rationale for the Crypto AI Advisor Dashboard.

## 1. Monorepo Structure (Turborepo)

### Decision: Use Turborepo for monorepo management

**Rationale**:
- Shared code (`ai-scoring` package) used by backend and tests
- Incremental builds - only rebuild changed packages
- Unified dependency management
- Single CI/CD pipeline for all packages

**Alternatives Considered**:
- Yarn Workspaces - Less sophisticated caching
- Nx - More complex, steeper learning curve
- Separate repositories - Code duplication, harder to maintain

**Benefits**:
- ✅ ~5x faster builds on CI/CD
- ✅ Shared types across apps
- ✅ Consistent tooling and dependencies
- ✅ Easier refactoring

## 2. Backend Technology Stack

### Decision: Node.js (TypeScript) instead of Python

**Rationale**:
- Consistent language across monorepo
- Better TypeScript ecosystem for Supabase, Anthropic SDKs
- Faster development cycles
- Easier to teach and collaborate

**Alternatives Considered**:
- Python (original spec) - Less integration with frontend stack
- Go - Overkill for polling service
- Rust - Compilation complexity

**Backend Architecture**:
```
TokenPoller (orchestrator)
  ├── DexscreenerClient (fetch data)
  ├── AIScorer (score tokens)
  │   ├── Real mode (Claude API)
  │   └── Mock mode (deterministic)
  ├── Database (Supabase operations)
  └── Logger (structured logging)
```

## 3. AI Scoring Approach

### Decision: Deterministic mock + optional Claude integration

**Rationale**:
- Mock mode allows testing without API costs
- Claude provides real intelligence when enabled
- Mockable for unit tests
- No breaking changes if API unavailable

**Scoring Methodology**:

Each token scored on 4 dimensions (0-100):
1. **Technical** (price action, volume/liquidity ratio)
2. **Fundamental** (market cap, liquidity strength)
3. **On-Chain** (transaction velocity, holder distribution)
4. **Sentiment** (volume growth, price trends)

Overall score = weighted average of above

Risk assessment identifies:
- Low liquidity warnings
- New token flags
- Volatility indicators
- Concentration risks

## 4. Database Design

### Decision: Supabase PostgreSQL + RLS

**Rationale**:
- Managed PostgreSQL - no DevOps overhead
- Row-level security (RLS) for multi-tenant future
- Real-time subscriptions for dashboard
- Generous free tier

**Schema Design**:
- **tokens** table (current data, upserted each cycle)
- **history** table (snapshots for trend analysis)
- Indexes on frequent queries (chain, score, timestamp)

**Alternative Considered**:
- Firebase - Worse for complex queries
- MongoDB - No strong schema, harder to query
- DynamoDB - Overkill, pay-per-request

## 5. Frontend Framework

### Decision: Next.js 14 + App Router + Tailwind CSS

**Rationale**:
- Server-side rendering options
- Built-in image optimization
- Vercel integration (same company, seamless deployment)
- App Router simplifies routing
- Tailwind for rapid UI development

**Component Structure**:
```
useTokens (fetch + subscribe)
  ├── Header (stats)
  ├── FilterBar (controls)
  └── TokenTable (display)
```

## 6. Deployment Architecture

### Backend (Polling Service)
- Runs via GitHub Actions on schedule
- No persistent server needed
- Triggered every 30 minutes
- Uses GitHub Secrets for credentials

### Frontend (Dashboard)
- Deployed to Vercel (auto-deploy on push)
- Next.js optimizations included
- Environment variables via Vercel project settings

### Database
- Supabase cloud (managed PostgreSQL)
- Automatic backups
- Multi-region option available

## 7. CI/CD Strategy

### GitHub Actions Workflows

**poll-tokens.yml** (Scheduled):
- Runs backend polling every 30 min
- Environment: production
- Timeout: 5 minutes

**deploy-dashboard.yml** (On push):
- Auto-deploys dashboard to Vercel
- Triggered on changes to `apps/dashboard`

**ci-cd.yml** (On push/PR):
- Lint, type-check, test, build
- Catches issues before merge

## 8. Error Handling & Resilience

### Backend Resilience:
- Retry logic with exponential backoff (3 attempts default)
- Timeout on external API calls (10 seconds)
- Graceful degradation (continue if one token fails)
- Structured logging for debugging

### Frontend Resilience:
- Error boundary components
- Retry button for API failures
- Graceful fallback to cached data
- Real-time subscription fallback to polling

## 9. Type Safety

### Strategy: Strict TypeScript across all packages

- `packages/ai-scoring` exports types
- `apps/backend` imports and uses types
- `apps/dashboard` reuses same types
- `tsconfig.json` shared with path mappings

**Benefits**:
- Compile-time error detection
- IDE autocomplete across monorepo
- Reduced bugs from type mismatches

## 10. Testing Strategy

### Unit Tests:
- AI scoring module (mock mode)
- Utility functions (logger, formatters)
- Database operations (mocked Supabase)

### Integration Tests:
- Real Supabase connection (staging database)
- Real DexScreener API calls
- End-to-end polling cycle

### E2E Tests:
- Dashboard filtering and display
- API data flow end-to-end

### Current State:
- Test files included as templates
- 🚧 Full test suite expansion needed

## 11. Scalability Considerations

### Horizontal Scaling:
- Backend can run on multiple CI runners
- Supabase auto-scales with connections
- Dashboard scales to unlimited users
- DexScreener rate limits only real constraint

### Database Optimization:
- Indexes on high-query columns
- Automatic query optimization
- Connection pooling via Supabase
- Archive history data after 30 days (optional)

### Future Optimizations:
- Caching layer (Redis) for frequently accessed tokens
- Message queue (RabbitMQ/SQS) for scoring jobs
- Distributed worker pool for scoring
- GraphQL API for frontend queries

## 12. Security Considerations

### Environment Variables:
- `.env` excluded from Git
- CI/CD uses GitHub Secrets
- Frontend uses public keys only
- Backend has service key for write access

### Database Security:
- RLS policies: public read, authenticated write
- No sensitive data stored
- Connection over TLS
- API keys not stored in database

### API Security:
- DexScreener (public API, no auth needed)
- Anthropic (key in backend CI/CD only)
- Supabase (keys via environment vars)

## 13. Why Supabase Not Traditional Backend?

### Decision: Serverless database + scheduled jobs vs. persistent backend

**Pros**:
- ✅ No server management
- ✅ Automatic scalability
- ✅ Pay only for what you use
- ✅ Built-in authentication & RLS

**Cons**:
- ❌ Limited background job options (solved with GitHub Actions)
- ❌ Cold starts on polling (acceptable 30-min frequency)

**Verdict**: Fits perfectly for free-tier crypto project

---

## Trade-offs & Rationale

| Choice | Trade-off | Accepted Because |
|--------|-----------|------------------|
| Turborepo | Learning curve | Shared code, better caching |
| TypeScript | Compilation step | Type safety catches bugs early |
| Mock AI | Less realistic | Testing without API costs |
| GitHub Actions polling | Cold start | 30-min frequency acceptable |
| Supabase | Limited real-time features | Great for free tier + RLS |
| Next.js | Bundle size | Rapid development + Vercel sync |

---

## Future Architecture Improvements

1. **Caching Layer**: Redis for hot tokens
2. **Message Queue**: Distributed scoring jobs
3. **GraphQL API**: Better query flexibility
4. **WebSocket**: Real-time dashboard updates
5. **Mobile App**: React Native for mobile
6. **Analytics**: Trend analysis and backtesting
7. **Notifications**: Email/SMS on score changes (if needed)
8. **API Gateway**: Rate limiting and usage tracking

---

See [README.md](README.md) for deployment and usage docs.
