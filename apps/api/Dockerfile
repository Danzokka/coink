# Stage 1: Builder
# Build context é a raiz do monorepo (docker-compose context: .)
FROM node:22-alpine AS builder
WORKDIR /app
COPY apps/api/package*.json ./
RUN npm install
COPY apps/api/ .
# Generate the Prisma client during the build stage
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build

# Stage 2: Production runtime
FROM node:22-alpine
WORKDIR /app
# Install necessary libraries for Prisma on alpine (e.g., libssl-dev)
RUN apk add --no-cache openssl
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./package*.json
COPY --from=builder /app/dist ./dist
# Copy the prisma directory including the migration history
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000

# Run migrations and start the app with a custom command/script
CMD [ "npm", "run", "start:prod" ]
