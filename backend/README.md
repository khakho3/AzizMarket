# Seller Marketplace API

FastAPI foundation for the Seller Marketplace platform. This initial backend provides centralized environment configuration, CORS for the local Next.js frontend, SQLAlchemy session management, Alembic migration support, and health endpoints. Marketplace business models and authentication are intentionally not included yet.

## Requirements

- Python 3.11 or newer
- MySQL 8 or newer for the database health check and future migrations

## Set up on Windows PowerShell

Run these commands from the `backend` folder.

1. Create a virtual environment:

   ```powershell
   py -m venv .venv
   ```

2. Activate it:

   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```

   If PowerShell blocks local activation scripts, enable them for only the current process and try again:

   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```

3. Install the dependencies:

   ```powershell
   python -m pip install -r requirements.txt
   ```

4. Create the local environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

5. Update `DATABASE_URL` and `SECRET_KEY` in `.env` with your local development values. Never commit `.env`.

## Run the API

```powershell
fastapi dev app/main.py
```

The API is available at `http://127.0.0.1:8000`. Interactive Swagger documentation is at `http://127.0.0.1:8000/docs`.

Available foundation endpoints:

- `GET /` returns basic API information.
- `GET /api/v1/health` checks the API without connecting to MySQL.
- `GET /api/v1/health/database` runs `SELECT 1` against MySQL and returns HTTP 503 with a safe message if the database is unavailable.

## Run tests

```powershell
python -m pytest
```

The current tests do not require a running MySQL instance.

## Database migrations

Schema changes must be managed with Alembic; the application does not create tables automatically. Future SQLAlchemy models should be imported by `app/models/__init__.py` so Alembic autogeneration can discover their metadata.

After models are added, create and apply migrations with:

```powershell
alembic revision --autogenerate -m "describe the schema change"
alembic upgrade head
```

The first marketplace migration creates users, seller profiles, stores,
categories, products, product images, and product specifications. Apply all
available migrations before running data-management scripts.

Seed the initial main categories and subcategories with:

```powershell
python -m app.scripts.seed_categories
```

The category seed is idempotent, so it is safe to run more than once.

## Authentication

Authentication endpoints are available under `/api/v1/auth`. Buyer and seller
registration, JSON login, refresh-token rotation, logout, and the current-user
endpoint are documented in Swagger. Access tokens are short-lived JWTs; raw
refresh tokens are returned only to the client and only their SHA-256 hashes are
stored in MySQL. Passwords are hashed with Argon2.

Temporary role-verification routes are available at:

- `/api/v1/protected/buyer`
- `/api/v1/protected/seller`
- `/api/v1/protected/admin`

To create the first administrator, set `ADMIN_NAME`, `ADMIN_EMAIL`,
`ADMIN_PASSWORD`, and optionally `ADMIN_PHONE` in `.env`, then run:

```powershell
python -m app.scripts.create_admin
```

The command refuses the `CHANGE_ME` placeholder and never prints the password.
