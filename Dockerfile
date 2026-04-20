# FROM node:20-alpine
# RUN apk add --no-cache openssl

# EXPOSE 3000

# WORKDIR /app

# ENV NODE_ENV=production

# COPY package.json package-lock.json* ./

# RUN npm ci --omit=dev && npm cache clean --force

# COPY . .

# RUN npm run build

# CMD ["npm", "run", "docker-start"]
# ---------- deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl

COPY package.json package-lock.json* ./
RUN npm ci

# ---------- build ----------
FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build your Shopify app (Remix build / whatever your app uses)
RUN npm run build

# ---------- runner (final image) ----------
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl

ENV NODE_ENV=production
EXPOSE 4000

# Copy package files
COPY package.json package-lock.json* ./

# Install ONLY production deps in final image
RUN npm ci --omit=dev && npm cache clean --force

# Copy build output
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public

# ✅ IMPORTANT: Prisma schema + migrations needed for generate/migrate
COPY --from=build /app/prisma ./prisma

# Copy EJS templates
COPY --from=build /app/app/utils/template ./app/utils/template
# If your app needs other runtime files, copy them too (optional)
# COPY --from=build /app/shopify.app.toml ./shopify.app.toml

CMD ["npm", "run", "docker-start"]