# Docker Setup (Optional)

Docker configuration for containerized deployment.

## Dockerfile for Backend

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/package.json ./

# Environment
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "console.log('ok')" || exit 1

# Run
ENTRYPOINT ["node", "dist/index.js"]
```

Save as: `apps/backend/Dockerfile`

## Docker Compose (Optional)

```yaml
version: '3'

services:
  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    environment:
      SUPABASE_URL: ${SUPABASE_URL}
      SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY}
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
    restart: always
```

Save as: `docker-compose.yml`

## Build & Run

```bash
# Build image
docker build -f apps/backend/Dockerfile -t crypto-ai-backend:latest .

# Run container
docker run --env-file .env crypto-ai-backend:latest

# Or with Docker Compose
docker-compose up --build
```

Note: Complete setup uses GitHub Actions, not manual Docker deployment.
