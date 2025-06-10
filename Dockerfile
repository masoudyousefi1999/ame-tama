# ─── Build Stage ───────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

# Copy lockfile first for deterministic installs
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source & build
COPY . .
RUN yarn build

# ─── Production Stage ─────────────────────────────────────────────────────────
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy only what’s needed to install production deps
COPY package.json yarn.lock ./

# Install only production deps
RUN yarn install --frozen-lockfile --production

# Bring in build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["yarn", "start"]
