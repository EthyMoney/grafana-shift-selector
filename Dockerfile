FROM node:24-slim

RUN apt-get update && apt-get install -y \
  g++ \
  make \
  python3 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && corepack pnpm install --frozen-lockfile --unsafe-perm

COPY . .

ENV development true

CMD ["pnpm", "dev"]
