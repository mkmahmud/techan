# Backend Documentation

NestJS backend for Techan using Prisma and PostgreSQL.

## Tech Stack

- NestJS
- Prisma
- PostgreSQL
- Zod validation
- JWT authentication

## Local Setup

```bash
npm install
cp .env.example .env
```

Update `.env` if needed, then run:

```bash
npm run db:migrate
npm run db:seed
npm run start:dev
```

Backend endpoints:

- API: http://localhost:5000/api 

## Docker Setup

From project root:

```bash
docker compose up --build
```

Backend waits for PostgreSQL, runs migrations, checks seed data, then starts.

## Environment Variables

Important values:

- `PORT`
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `COOKIE_SECRET`
- `CORS_ORIGINS`

See `.env.example` for full list.

## Useful Commands

```bash
npm run start:dev
npm run build
npm run start:prod
npm run db:migrate
npm run db:seed
npm run db:studio
npm test
npm run test:e2e
```

## Seed Credentials

- Admin email: admin@techan.com
- Password: Admin@1234
 