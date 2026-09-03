FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# ─── Development ──────────────────────────────────────────────────────────────
FROM base AS development

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# ─── Build stage ──────────────────────────────────────────────────────────────
FROM base AS builder

COPY . .

ENV NEXT_STANDALONE=true
# Build Next.js untuk production
RUN npm run build


# ─── Production stage ─────────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy hanya artifact yang diperlukan dari builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
