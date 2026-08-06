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

# Cache-bust ARG: pass --build-arg CACHEBUST=$(date +%s) to force fresh clone
ARG CACHEBUST=1

# Clone latest code from GitHub (Portainer build context is empty, only has compose file)
RUN echo "Cache bust: $CACHEBUST" \
 && git clone --depth 1 https://github.com/dearrowsa-cyber/D-arrow.git /tmp/repo \
 && cp -a /tmp/repo/. /app/ \
 && rm -rf /tmp/repo/.git \
 && git -C /app log --oneline -1 2>/dev/null || echo "Cloned repo successfully" \
 && ls -la /app/app/\(main\)/demo/ 2>/dev/null || echo "WARNING: demo directory missing after clone"

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

# Fallback copy paths — covers both standalone and non-standalone Next configs.
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

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
exec node_modules/.bin/next start -H "${HOSTNAME}" -p "${PORT}"
EOF
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["tini", "--", "/app/entrypoint.sh"]
