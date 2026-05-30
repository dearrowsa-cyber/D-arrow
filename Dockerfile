FROM node:20-slim AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy everything first
COPY . .

# Install dependencies (skip postinstall to avoid prisma issues during build)
RUN npm install --ignore-scripts --legacy-peer-deps

# Generate Prisma client manually
RUN npx prisma generate

# Build the Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production image
FROM node:20-slim AS runner
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=base /app/public ./public
COPY --from=base --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=base /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=base /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
