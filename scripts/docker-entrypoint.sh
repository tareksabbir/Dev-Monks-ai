#!/bin/sh

# Exit on error
set -e

echo "Waiting for database to be ready..."

# Use nc if available, otherwise fallback to sleep-based retry
if command -v nc > /dev/null 2>&1; then
  until nc -z db 5432; do
    echo "Database is unavailable - sleeping"
    sleep 1
  done
else
  echo "nc not found, using sleep-based wait..."
  sleep 5
fi

echo "Database is up - executing migrations"
npx prisma migrate deploy

echo "Starting the application"
exec "$@"
