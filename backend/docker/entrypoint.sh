#!/bin/sh
set -e

echo "Waiting for PostgreSQL..."
until npx prisma migrate deploy; do
  echo "Database not reachable or migration failed. Retrying in 2s..."
  sleep 2
done

echo "Applying migrations..."
npx prisma migrate deploy

echo "Checking whether seed is needed..."
SEED_NEEDED=$(node -e 'const { PrismaClient } = require("@prisma/client"); const prisma = new PrismaClient(); prisma.user.count().then((count) => { console.log(count === 0 ? "yes" : "no"); }).catch(() => { console.log("yes"); }).finally(async () => { await prisma.$disconnect(); });')

if [ "$SEED_NEEDED" = "yes" ]; then
  echo "No users found. Running seed..."
  npm run db:seed
else
  echo "Existing data detected. Skipping seed."
fi

echo "Starting backend..."
exec npm run start:prod
