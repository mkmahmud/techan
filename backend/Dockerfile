FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY prisma ./prisma
COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 5000

CMD ["/entrypoint.sh"]
