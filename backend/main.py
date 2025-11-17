from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Portfolio Tracker API",
    description="Backend for token-based portfolio tracking",
    version="0.1.0",
)

# ----- CORS (allow frontend to call backend in dev) -----

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----- Models (just mock for now) -----

class Position(BaseModel):
    symbol: str
    name: str
    qty: float
    avg_cost: float
    price: float
    weight: float  # percent


mock_positions = [
    Position(symbol="AAPL", name="Apple Inc.", qty=24, avg_cost=168.12, price=177.22, weight=28),
    Position(symbol="MSFT", name="Microsoft", qty=12, avg_cost=362.15, price=375.31, weight=24),
    Position(symbol="NVDA", name="NVIDIA", qty=6, avg_cost=844.20, price=867.90, weight=18),
    Position(symbol="VOO", name="S&P 500 ETF", qty=10, avg_cost=505.40, price=512.10, weight=15),
    Position(symbol="TSLA", name="Tesla", qty=8, avg_cost=232.10, price=228.70, weight=10),
]


# ----- Routes -----

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/portfolio/{token}", response_model=List[Position])
def get_portfolio_for_token(token: str):
    """
    Temporary mock endpoint.
    Later: look up this token in Postgres and return stored positions.
    For now: always returns the same mock positions.
    """
    return mock_positions
