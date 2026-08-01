FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Pull latest committed code from GitHub
RUN git clone --depth=1 --branch main https://github.com/dearrowsa-cyber/D-arrow.git .

# Install dependencies cleanly
RUN npm install --legacy-peer-deps

# Generate Prisma Client
RUN npx prisma generate

# Build full Next.js production bundle
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "start"]
