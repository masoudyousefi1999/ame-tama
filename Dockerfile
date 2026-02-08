# ----------------------------- creating dependencies -----------------------------

FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile


# ----------------------------- building project     -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN yarn build

# ----------------------------- running  project     -----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./standalone
COPY --from=builder /app/.next/static ./static

EXPOSE 3000

CMD ["node", "standalone/server.js"]