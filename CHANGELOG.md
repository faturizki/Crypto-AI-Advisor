# Changelog

All notable changes to Crypto AI Advisor will be documented in this file.

## [1.0.0] - 2026-04-01

### Added
- ✨ Full production-ready Turborepo monorepo structure
- ✨ Backend polling service with DexScreener API integration
- ✨ AI scoring module with Claude and mock implementations
- ✨ Next.js dashboard with real-time token display
- ✨ Supabase PostgreSQL database with schema and RLS
- ✨ GitHub Actions for automated polling and deployment
- ✨ TypeScript across all packages with strict mode
- ✨ Comprehensive documentation (README, SETUP, ARCHITECTURE)
- ✨ Sample data seeding for testing
- ✨ Environment configuration and validation
- 📦 ai-scoring package with exports
- 📦 Backend app with retry logic and logging
- 📦 Dashboard app with filtering and real-time updates

### Features
- Real-time crypto token monitoring from DexScreener
- AI-powered multi-dimensional scoring (technical, fundamental, on-chain, sentiment)
- Risk assessment and probability predictions
- Interactive dashboard with advanced filtering
- Automated polling every 30 minutes via GitHub Actions
- Vercel deployment for frontend
- Supabase row-level security
- Mock AI mode for testing without API costs

### Documentation
- Complete setup guide (SETUP.md)
- Architecture decisions (ARCHITECTURE.md)
- Development guidelines (DEVELOPMENT.md)
- Docker configuration (DOCKER.md)

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create Git tag: `git tag v<version>`
4. Push to GitHub: `git push --tags`
5. Create GitHub Release with changelog
6. Deploy if applicable
