FROM node:22-alpine AS deps
WORKDIR /app

RUN corepack enable
RUN apk add --no-cache openssl

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile


FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable
RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm prisma:generate
RUN pnpm build


FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN corepack enable
RUN apk add --no-cache openssl

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/main"]

