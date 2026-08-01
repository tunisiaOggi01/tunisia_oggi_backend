# Stage 1: deps
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && cp -R node_modules /app/node_modules_prod && npm ci

# Stage 2: build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY --from=deps /app/node_modules_prod /app/node_modules_prod
COPY . .
RUN npx prisma generate && npm run build

# Stage 3: production
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules_prod ./node_modules
COPY --from=build /app/prisma ./prisma
COPY package*.json ./
EXPOSE 3000
CMD npx prisma migrate deploy && node dist/main
