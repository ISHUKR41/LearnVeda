/**
 * FILE: Dockerfile
 * LOCATION: backend/Dockerfile
 * PURPOSE: Production-optimized Docker container for the EduQuest backend.
 *          Multi-stage build for minimal image size (~150MB vs 1GB+ naive build).
 *
 * BUILD STAGES:
 *  1. deps     — Install only production dependencies (no devDependencies)
 *  2. builder  — Compile TypeScript to JavaScript
 *  3. runner   — Minimal runtime image with compiled code + prod deps
 *
 * SECURITY:
 *  - Non-root user (node:node) for container process
 *  - No devDependencies or source code in final image
 *  - Health check built into container
 *
 * USAGE:
 *   docker build -t eduquest-backend .
 *   docker run -p 4000:4000 --env-file .env eduquest-backend
 *
 * LAST UPDATED: 2026-05-26
 */

# ─── Stage 1: Install production dependencies ───────────────
FROM node:20-alpine AS deps

# Set working directory inside the container
WORKDIR /app

# Copy only package files first (better Docker layer caching)
COPY package.json package-lock.json ./

# Install ONLY production dependencies (skip devDependencies)
RUN npm ci --omit=dev


# ─── Stage 2: Build TypeScript to JavaScript ────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy all dependencies (including devDependencies for tsc)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY src/ ./src/
COPY prisma/ ./prisma/

# Compile TypeScript
RUN npm run build


# ─── Stage 3: Production runtime ────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 eduquest

# Copy production dependencies from stage 1
COPY --from=deps /app/node_modules ./node_modules

# Copy compiled JavaScript from stage 2
COPY --from=builder /app/dist ./dist

# Copy necessary config files
COPY package.json ./

# Create uploads directory with correct permissions
RUN mkdir -p uploads && chown -R eduquest:nodejs uploads

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expose the server port
EXPOSE 4000

# Switch to non-root user
USER eduquest

# Health check — verify the server is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

# Start the server
CMD ["node", "dist/index.js"]
