# syntax=docker/dockerfile:1

# ---------- Stage 1: build ----------
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies (leverage cache layer)
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Biến VITE_* được nhúng lúc build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Nitro preset: node-server builds a standalone Node.js server in .output/
ENV NITRO_PRESET=node-server
RUN npm run build

# ---------- Stage 2: runtime ----------
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

# .output already bundles required node_modules — no npm install needed
COPY --from=build /app/.output ./.output

USER node
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
