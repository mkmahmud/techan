# Frontend Documentation

Next.js frontend for Techan.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Axios
- Zustand

## Local Setup

```bash
npm install
```

Create `.env.local` and set API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run development server:

```bash
npm run dev
```

Open:

- http://localhost:3000

## Docker Setup

Frontend runs with the root Docker Compose command:

```bash
docker compose up --build
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

- Frontend expects backend API at `NEXT_PUBLIC_API_URL`.
- If backend runs on another host or port, update `.env.local` and restart frontend.
 