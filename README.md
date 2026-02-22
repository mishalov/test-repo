# Ping Tracker

A full-stack application that accepts device ping data (UUID and battery level) via a REST API and displays submission history in a web interface.

## Tech Stack

- **Backend:** PHP 8.2, Laravel 12, PostgreSQL 16
- **Frontend:** Vue 3, TypeScript, Vite
- **Testing:** PHPUnit (backend), Vitest (frontend)
- **Infrastructure:** Docker
- ***REQUIRED NODE JS VERSION*** : 22+. Tested with 22.16

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Run with Docker

```bash
# Generate an application key and start all services
APP_KEY=base64:$(openssl rand -base64 32) docker compose up --build -d
```

This starts three containers:

| Service | URL | Description |
|---------|-----|-------------|
| `php` | http://localhost:8000 | Laravel dev server |
| `db` | - | PostgreSQL database (internal; accessible via Adminer or from within the Docker network) |
| `adminer` | http://localhost:8080 | Database management UI |

Database migrations run automatically on container startup.

### Run the Frontend (development)

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server starts at http://localhost:5173 and proxies `/api` requests to the backend.

## API

### `POST /api/ping`

Save a device ping.

**Request body:**

```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "battery_percent": 72
}
```

| Field | Type | Rules |
|-------|------|-------|
| `uuid` | string | Required. Valid UUID. |
| `battery_percent` | integer | Required. 0--100. |

**Success response** (`200 OK`):

```json
{
  "status": "ok"
}
```

**Validation error** (`422 Unprocessable Entity`):

```json
{
  "message": "The uuid field is required.",
  "errors": {
    "uuid": ["The uuid field is required."]
  }
}
```

### `GET /api/ping`

Returns the 100 most recent pings, ordered newest first.

## Testing

A helper script at the project root runs both test suites:

```bash
# Run all tests
./run-tests.sh

# Run only backend or frontend tests
./run-tests.sh backend
./run-tests.sh frontend
```

Or run each suite directly:

```bash
# Backend (requires PHP and Composer dependencies)
cd backend && php vendor/bin/phpunit --testdox

# Frontend
cd frontend && npx vitest run --coverage
```

## Good to have but since this is not a real project I decided to skip:

- e2e Tests: I would add Playwright for Happy Path scenario
- Swagger: Open Api documentation
- Storybook: Great for showing VUE components