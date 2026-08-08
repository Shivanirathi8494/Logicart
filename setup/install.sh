#!/usr/bin/env bash

set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
WEB_DIR="$ROOT_DIR/apps/web"

echo ""
echo "=========================================="
echo "        LOGICARTS LMS INSTALLER"
echo "=========================================="
echo ""

echo "Project: $ROOT_DIR"
echo "Web:     $WEB_DIR"
echo ""

# ------------------------------------------
# Check Docker
# ------------------------------------------

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: Docker is not installed."
  echo "Please install Docker Desktop and run this installer again."
  exit 1
fi

echo "✓ Docker found"

if ! docker compose version >/dev/null 2>&1; then
  echo "ERROR: Docker Compose is not available."
  exit 1
fi

echo "✓ Docker Compose found"

# ------------------------------------------
# Check Node.js
# ------------------------------------------

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js is not installed."
  exit 1
fi

echo "✓ Node.js found: $(node --version)"

# ------------------------------------------
# Check npm
# ------------------------------------------

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm is not installed."
  exit 1
fi

echo "✓ npm found: $(npm --version)"

# ------------------------------------------
# Start PostgreSQL
# ------------------------------------------

echo ""
echo "Starting PostgreSQL..."

cd "$ROOT_DIR"

docker compose up -d postgres

echo "✓ PostgreSQL container started"

# ------------------------------------------
# Wait for PostgreSQL
# ------------------------------------------

echo ""
echo "Waiting for PostgreSQL..."

for i in {1..30}; do

  if docker exec logicarts-postgres \
    pg_isready -U logicarts -d logicarts >/dev/null 2>&1; then

    echo "✓ PostgreSQL is ready"
    break

  fi

  if [ "$i" -eq 30 ]; then
    echo "ERROR: PostgreSQL did not become ready."
    exit 1
  fi

  sleep 2

done

# ------------------------------------------
# Create local DATABASE_URL
# ------------------------------------------

ENV_FILE="$WEB_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then

  cat > "$ENV_FILE" <<EOF
DATABASE_URL="postgresql://logicarts:logicarts@localhost:5432/logicarts?schema=public"
EOF

  echo "✓ Created apps/web/.env"

else

  echo "✓ apps/web/.env already exists"

fi

# ------------------------------------------
# Install dependencies
# ------------------------------------------

cd "$WEB_DIR"

echo ""
echo "Installing Node dependencies..."

npm install

echo "✓ Dependencies installed"

# ------------------------------------------
# Prisma
# ------------------------------------------

echo ""
echo "Generating Prisma Client..."

npx prisma generate

echo "✓ Prisma Client generated"

echo ""
echo "Applying database migrations..."

npx prisma migrate deploy

echo "✓ Database migrations applied"

# ------------------------------------------
# Seed
# ------------------------------------------

echo ""
echo "Running database seed..."

npx prisma db seed

echo "✓ Database seed completed"

# ------------------------------------------
# Build
# ------------------------------------------

echo ""
echo "Building Logicarts..."

npm run build

echo "✓ Logicarts build completed"

# ------------------------------------------
# Finish
# ------------------------------------------

echo ""
echo "=========================================="
echo "       LOGICARTS SETUP COMPLETE"
echo "=========================================="
echo ""
echo "Database:"
echo "  PostgreSQL: localhost:5432"
echo "  Database:   logicarts"
echo ""
echo "Application:"
echo "  http://localhost:3000"
echo ""
echo "Start Logicarts with:"
echo "  cd apps/web"
echo "  npm run start"
echo ""
echo "=========================================="
echo ""
