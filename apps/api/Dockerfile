# syntax=docker/dockerfile:1
# coink-api - Backend NestJS
FROM node:20-alpine AS base

RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Builder stage
FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN pnpm install --frozen-lockfile

# Build API (runs prisma generate + nest build via package.json)
RUN pnpm build --filter=api

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache wget

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy workspace for prisma and node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/api /app/apps/api
COPY --from=builder /app/packages /app/packages

# Garantir que o build da API (dist) esteja no runner (evita MODULE_NOT_FOUND)
COPY --from=builder /app/apps/api/dist /app/apps/api/dist

# Prisma schema and migrations for runtime migrate
COPY --from=builder /app/apps/api/prisma /app/apps/api/prisma

USER nestjs

EXPOSE 5000

WORKDIR /app/apps/api

# Run migrations then start (use shell so we can chain)
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/main.js"]
