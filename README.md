# Techan

Techan is a full stack task management project.

## Project Structure

- `frontend`: Next.js application
- `backend`: NestJS API with Prisma
- `db`: PostgreSQL (via Docker Compose)

## Quick Start with Docker

Run everything with one command:

```bash
docker compose up --build
```

Services:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
 
## Stop Services

```bash
docker compose down
```

## Reset Database and Re-run Seed

```bash
docker compose down -v
docker compose up --build
```

## Default Seed Credentials

- Admin email: admin@techan.com
- Password: Admin@1234

## Run Without Docker

Open two terminals.

Terminal 1:

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run start:dev
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

## Documentation

- Backend guide: `backend/README.md`
- Frontend guide: `frontend/README.md`
