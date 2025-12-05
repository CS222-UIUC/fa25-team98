# Portfolio Tracker Backend (FastAPI)

FastAPI backend for a token-based portfolio tracker with simple quote caching and summary calculations. Alpha Vantage is used for market data (with DB-backed caching). SQLite is the default local DB; switch to Postgres in production via `DATABASE_URL`.

## Quick Start (Local)

1. Create and activate a virtual env (optional but recommended)
2. Install deps
3. Run the server

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
# Edit .env to set ALPHAVANTAGE_API_KEY and DATABASE_URL as needed
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Environment

- `ALPHAVANTAGE_API_KEY`: Alpha Vantage API key (optional; mock price used if empty)
- `DATABASE_URL`: SQLAlchemy URL. Defaults to `sqlite:///./app.db`. Example Postgres:
  `postgresql+psycopg2://user:password@localhost:5432/portfolio`
- `PRICE_CACHE_TTL_SECONDS`: Quote cache TTL in seconds (default 900 secs)

## Key Endpoints

- `GET /health`: Service status
- `POST /portfolio`: Create portfolio, optional positions (returns `{ token }`)
- `GET /portfolio/{token}`: Positions with latest prices and weights
- `PUT /portfolio/{token}`: Replace positions for a token
- `GET /portfolio/{token}/summary`: Totals and PnL
- `GET /quote/{symbol}`: Latest price (cached)
- `POST /sentiment`: Lightweight sentiment scores (VADER)

### Sample payloads

Replace positions:
```json
[
  {"symbol": "AAPL", "qty": 10, "avg_cost": 170, "name": "Apple Inc."},
  {"symbol": "MSFT", "qty": 5, "avg_cost": 360}
]
```

## Docker

```powershell
# Build
docker build -t portfolio-backend ./

# Run with SQLite
docker run --rm -p 8000:8000 --env-file .env portfolio-backend

# Run with Postgres
# docker run -e DATABASE_URL="postgresql+psycopg2://user:pass@host:5432/db" \
#            -e ALPHAVANTAGE_API_KEY=YOUR_KEY -p 8000:8000 portfolio-backend
```

## Tests

```powershell
pytest -q
```
