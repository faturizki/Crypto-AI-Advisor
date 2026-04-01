# Development Guidelines

Best practices for contributing to Crypto AI Advisor.

## Code Style

### TypeScript

- Use strict mode (`"strict": true` in tsconfig.json)
- Prefer interfaces over types for object shapes
- Add JSDoc comments to all exported functions
- Use meaningful variable names (no single letters except `i`, `j` in loops)

### Naming Conventions

```typescript
// Functions: camelCase
async function scoreToken(data: TokenData): Promise<TokenScore> {}

// Classes: PascalCase
class TokenPoller {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;

// Types/Interfaces: PascalCase
interface TokenData {}
type ScoringResult = {...};
```

### Comments

```typescript
/**
 * Fetch tokens from DexScreener
 * @param limit - Max tokens to fetch
 * @returns Array of token data
 * @throws Error if API call fails
 * @example
 * ```typescript
 * const tokens = await client.getTokens(50);
 * ```
 */
async function getTokens(limit: number): Promise<Token[]> {
  // Implementation
}
```

## Git Workflow

### Branch Naming

```
feature/add-new-scoring-dimension
bugfix/fix-supabase-connection
docs/update-setup-guide
chore/upgrade-dependencies
```

### Commit Messages

```
feat: add new AI scoring dimension
fix: resolve database connection timeout
docs: update README with examples
test: add unit tests for TokenPoller
refactor: extract logger utility
```

### Pull Requests

1. Clear title and description
2. Link related issues
3. Include screenshots if UI changes
4. Explain rationale for changes

## Testing

### Unit Tests

```typescript
describe("TokenPoller", () => {
  it("should fetch tokens from DexScreener", async () => {
    // Arrange
    const poller = new TokenPoller();

    // Act
    const tokens = await poller.getLatestTokens(10);

    // Assert
    expect(tokens).toHaveLength(10);
  });
});
```

### Test Coverage

- Aim for >80% coverage on production code
- Test happy paths and error cases
- Mock external dependencies

Run: `npm test -- --coverage`

## Performance

### Do

- ✅ Use connection pooling for databases
- ✅ Batch database operations
- ✅ Implement retry logic with backoff
- ✅ Cache frequently accessed data
- ✅ Use streaming for large datasets

### Don't

- ❌ Make synchronous HTTP calls
- ❌ Block the event loop
- ❌ Store large objects in memory
- ❌ Poll without backoff/rate limiting

## Security

- Never log credentials or API keys
- Validate all external inputs
- Use parameterized queries (ORM handles this)
- Prefer read-only database roles where possible
- Rotate API keys regularly

## Documentation

- Update README if changing user-facing behavior
- Add JSDoc to exported functions
- Include examples in complex functions
- Document breaking changes in CHANGELOG

## Local Development

### Setup

```bash
npm install          # Install dependencies
npm run build        # Build all packages
npm run type-check   # Check types
npm run lint         # Run linter
npm run test         # Run tests
npm run dev          # Start dev servers
```

### Before Submitting PR

```bash
npm run lint         # Fix any style issues
npm run type-check   # Ensure no type errors
npm run test         # All tests pass
npm run build        # Build succeeds
```

## Release Checklist

- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Create Git tag: `git tag v1.0.0`
- [ ] Push tag: `git push --tags`
- [ ] Create GitHub Release with notes
- [ ] Deploy to production if applicable

---

Feel free to reach out with questions!
