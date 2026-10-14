# ==============================================================================
# BenefitLens - Multi-Stage Production Dockerfile
# Optimized for ultra-fast response times, zero CORS latency, and high stability.
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Frontend SPA
# ------------------------------------------------------------------------------
FROM node:20-alpine AS client-builder
WORKDIR /app/client

# Cache package dependencies
COPY client/package*.json ./
RUN npm ci

# Copy client source and build optimized production bundle
COPY client/ ./
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Production Server Runner
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Install curl for container health check
RUN apk add --no-cache curl

# Cache server dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --omit=dev

# Copy server application source
COPY server/src ./src
COPY server/uploads ./uploads

# Copy built frontend assets from Stage 1 into client/dist
COPY --from=client-builder /app/client/dist /app/client/dist

# Ensure upload directory exists
RUN mkdir -p uploads

# Environment configuration
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Health check to ensure zero crashouts & self-healing in production
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start BenefitLens production server
CMD ["node", "src/server.js"]
