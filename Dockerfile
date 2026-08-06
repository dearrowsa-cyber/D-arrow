# syntax=docker/dockerfile:1.6
#
# D-Arrow Next.js — Production Dockerfile
# Usage:
#   docker build -t d-arrow-app .
#   docker run --env-file .env -p 3000:3000 d-arrow-app
#
# Designed to work inside Portainer Stacks on any Linux VPS.
# ------------------------------------------------------------------------------

# --- DEPS STAGE ---------------------------------------------------------------
FROM node:20-slim AS deps
WORKDIR /app

# Required for Prisma + native modules (sharp, better-sqlite3, etc.)
RUN apt-get update -y \
 && apt-get install -y --no-install-recommends \
      ca-certificates \
      curl \
      git \
      openssl \
      procps \
      python3 \
      make \
      g++ \
 && rm -rf /var/lib/apt/lists/*

# Install only prod + dev dependencies we need for the build.
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# --- BUILD STAGE --------------------------------------------------------------
FROM node:20-slim AS builder
WORKDIR /app

RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl ca-certificates git \
 && rm -rf /var/lib/apt/lists/*

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# ✅ Use LOCAL project code (includes blog fallback + live store links fixes)
# ❌ Removed dangerous git clone that was overwriting local changes!
COPY . .

COPY --from=deps /app/node_modules ./node_modules

# Generate Prisma client from the committed schema, then build the Next.js app.
RUN npx prisma generate \
 && npm run build

# --- RUNTIME STAGE ------------------------------------------------------------
FROM node:20-slim AS runner
WORKDIR /app

RUN apt-get update -y \
 && apt-get install -y --no-install-recommends \
      ca-certificates \
      curl \
      openssl \
      tini \
 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js standalone output (next.config.js -> output: 'standalone')
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Persisted mount targets (Portainer volumes will attach here).
RUN mkdir -p /app/public/uploads /app/data

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Entrypoint: run any pending Prisma migrations against DATABASE_URL, then exec
# the Next server. Tini ensures proper reaping of child processes.
COPY <<'EOF' /app/entrypoint.sh
#!/usr/bin/env bash
set -euo pipefail
echo "[entrypoint] Applying pending Prisma migrations..."
npx prisma migrate deploy || echo "[entrypoint] WARNING: prisma migrate deploy failed (skip if dev.db unused)"
echo "[entrypoint] Starting Next.js server on ${HOSTNAME}:${PORT}"
exec node server.js
EOF
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["tini", "--", "/app/entrypoint.sh"]
