import os
import time
from datetime import datetime, timedelta
from typing import List, Optional

import httpx
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
    create_engine,
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, relationship, sessionmaker


# ----- Environment and App -----

load_dotenv()

ALPHAVANTAGE_API_KEY = os.getenv("ALPHAVANTAGE_API_KEY", "")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
PRICE_CACHE_TTL_SECONDS = int(os.getenv("PRICE_CACHE_TTL_SECONDS", "900"))  # 15 min default

app = FastAPI(
    title="Portfolio Tracker API",
    description="Backend for token-based portfolio tracking",
    version="0.2.0",
)

# CORS (allow frontend to call backend in dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----- Database Setup -----


class Base(DeclarativeBase):
    pass


class Portfolio(Base):
    __tablename__ = "portfolios"
    token: Mapped[str] = mapped_column(String(64), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    positions: Mapped[List["DBPosition"]] = relationship(
        back_populates="portfolio", cascade="all, delete-orphan"
    )


class DBPosition(Base):
    __tablename__ = "positions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    token: Mapped[str] = mapped_column(String(64), ForeignKey("portfolios.token"), index=True)
    symbol: Mapped[str] = mapped_column(String(32))
    name: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    qty: Mapped[float] = mapped_column(Float)
    avg_cost: Mapped[float] = mapped_column(Float)

    portfolio: Mapped[Portfolio] = relationship(back_populates="positions")
    __table_args__ = (UniqueConstraint("token", "symbol", name="uq_token_symbol"),)


class Quote(Base):
    __tablename__ = "quotes"
    symbol: Mapped[str] = mapped_column(String(32), primary_key=True)
    price: Mapped[float] = mapped_column(Float)
    fetched_at: Mapped[datetime] = mapped_column(DateTime, index=True)


# Create engine and session factory
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def init_db():
    Base.metadata.create_all(engine)


@app.on_event("startup")
def on_startup():
    init_db()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ----- Schemas -----


class PositionIn(BaseModel):
    symbol: str
    qty: float
    avg_cost: float
    name: Optional[str] = None


class PositionOut(PositionIn):
    price: Optional[float] = None
    market_value: Optional[float] = None
    weight: Optional[float] = None


class PortfolioSummary(BaseModel):
    total_cost: float
    total_value: float
    pnl: float
    pnl_pct: float = Field(..., description="PnL as percent of cost basis")
    positions: List[PositionOut]


class CreatePortfolioResponse(BaseModel):
    token: str


# ----- Alpha Vantage Client with DB-backed Cache -----


class AlphaVantageClient:
    base_url = "https://www.alphavantage.co/query"

    def __init__(self, api_key: str):
        self.api_key = api_key
        self._client = httpx.Client(timeout=20.0)

    def get_price(self, symbol: str, db: Session) -> float:
        now = datetime.utcnow()
        # check cache
        q = db.get(Quote, symbol.upper())
        if q and (now - q.fetched_at) < timedelta(seconds=PRICE_CACHE_TTL_SECONDS):
            return q.price

        if not self.api_key:
            # no API key -> fallback mock price
            price = 100.0
        else:
            # Try GLOBAL_QUOTE first
            try:
                params = {"function": "GLOBAL_QUOTE", "symbol": symbol, "apikey": self.api_key}
                r = self._client.get(self.base_url, params=params)
                r.raise_for_status()
                data = r.json()
                price_str = (
                    data.get("Global Quote", {}).get("05. price")
                    or data.get("Global Quote", {}).get("05. Price")
                )
                if price_str:
                    price = float(price_str)
                else:
                    # Fallback: TIME_SERIES_DAILY last close
                    params = {
                        "function": "TIME_SERIES_DAILY",
                        "symbol": symbol,
                        "apikey": self.api_key,
                        "outputsize": "compact",
                    }
                    r = self._client.get(self.base_url, params=params)
                    r.raise_for_status()
                    data = r.json()
                    ts = data.get("Time Series (Daily)", {})
                    if not ts:
                        raise ValueError("No time series data returned")
                    latest_day = sorted(ts.keys())[-1]
                    price = float(ts[latest_day]["4. close"])  # close price
            except Exception:
                # keep service resilient under quota/network errors
                price = float(q.price) if q else 100.0

        # upsert cache
        cached = db.get(Quote, symbol.upper())
        if cached:
            cached.price = price
            cached.fetched_at = now
        else:
            db.add(Quote(symbol=symbol.upper(), price=price, fetched_at=now))
        db.commit()
        return price


alpha_client = AlphaVantageClient(ALPHAVANTAGE_API_KEY)


# ----- Routes -----


@app.get("/health")
def health_check():
    return {"status": "ok", "time": int(time.time())}


@app.post("/portfolio", response_model=CreatePortfolioResponse)
def create_portfolio(positions: Optional[List[PositionIn]] = None, db: Session = Depends(get_db)):
    import secrets

    token = secrets.token_urlsafe(16)
    portfolio = Portfolio(token=token)
    db.add(portfolio)
    db.flush()

    if positions:
        for p in positions:
            db.add(
                DBPosition(
                    token=token,
                    symbol=p.symbol.upper(),
                    name=p.name,
                    qty=p.qty,
                    avg_cost=p.avg_cost,
                )
            )
    db.commit()
    return CreatePortfolioResponse(token=token)


@app.get("/portfolio/{token}", response_model=List[PositionOut])
def get_portfolio_for_token(token: str, db: Session = Depends(get_db)):
    portfolio = db.get(Portfolio, token)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    # enrich with prices and weights
    enriched: List[PositionOut] = []
    values = []
    for pos in portfolio.positions:
        price = alpha_client.get_price(pos.symbol, db)
        mv = price * pos.qty
        values.append(mv)
        enriched.append(
            PositionOut(
                symbol=pos.symbol,
                name=pos.name,
                qty=pos.qty,
                avg_cost=pos.avg_cost,
                price=price,
                market_value=mv,
            )
        )

    total_value = sum(values) or 1.0
    for e in enriched:
        e.weight = round(100.0 * (e.market_value or 0.0) / total_value, 2)
    return enriched


@app.put("/portfolio/{token}", response_model=List[PositionOut])
def replace_portfolio_positions(token: str, positions: List[PositionIn], db: Session = Depends(get_db)):
    portfolio = db.get(Portfolio, token)
    if not portfolio:
        portfolio = Portfolio(token=token)
        db.add(portfolio)
        db.flush()

    # Clear existing
    db.query(DBPosition).filter(DBPosition.token == token).delete()
    for p in positions:
        db.add(
            DBPosition(
                token=token,
                symbol=p.symbol.upper(),
                name=p.name,
                qty=p.qty,
                avg_cost=p.avg_cost,
            )
        )
    db.commit()
    return get_portfolio_for_token(token, db)


@app.get("/quote/{symbol}")
def get_quote(symbol: str, db: Session = Depends(get_db)):
    price = alpha_client.get_price(symbol, db)
    return {"symbol": symbol.upper(), "price": price}


@app.get("/portfolio/{token}/summary", response_model=PortfolioSummary)
def portfolio_summary(token: str, db: Session = Depends(get_db)):
    portfolio = db.get(Portfolio, token)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    positions_out = get_portfolio_for_token(token, db)
    total_cost = sum((p.qty * p.avg_cost) for p in portfolio.positions)
    total_value = sum((p.market_value or 0.0) for p in positions_out)
    pnl = total_value - total_cost
    pnl_pct = (pnl / total_cost * 100.0) if total_cost else 0.0

    return PortfolioSummary(
        total_cost=round(total_cost, 2),
        total_value=round(total_value, 2),
        pnl=round(pnl, 2),
        pnl_pct=round(pnl_pct, 2),
        positions=positions_out,
    )


# ----- Sentiment (lightweight stub; spaCy can be integrated later) -----


try:
    from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

    _vader = SentimentIntensityAnalyzer()
except Exception:  # pragma: no cover
    _vader = None


class SentimentRequest(BaseModel):
    text: str


@app.post("/sentiment")
def sentiment(req: SentimentRequest):
    if _vader is None:
        return {"compound": 0.0, "pos": 0.0, "neu": 1.0, "neg": 0.0, "note": "VADER not installed"}
    scores = _vader.polarity_scores(req.text)
    return scores


# ----- Minimal /api routes to align with frontend service -----


def _token_from_header(x_pt_token: Optional[str] = Header(default=None)) -> str:
    if not x_pt_token:
        raise HTTPException(status_code=400, detail="Missing x-pt-token header")
    return x_pt_token


class PositionUpsert(BaseModel):
    symbol: str
    qty: float
    avg_cost: Optional[float] = Field(default=None, alias="avgCost")
    name: Optional[str] = None

    model_config = {
        "populate_by_name": True,
        "extra": "allow",  # accept avg_cost or avgCost
    }


@app.get("/api/health")
def api_health():
    return health_check()


@app.get("/api/positions", response_model=List[PositionOut])
def api_positions(token: str = Depends(_token_from_header), db: Session = Depends(get_db)):
    return get_portfolio_for_token(token, db)


@app.post("/api/positions", response_model=List[PositionOut])
def api_upsert_position(
    pos: PositionUpsert,
    token: str = Depends(_token_from_header),
    db: Session = Depends(get_db),
):
    portfolio = db.get(Portfolio, token)
    if not portfolio:
        portfolio = Portfolio(token=token)
        db.add(portfolio)
        db.flush()

    existing = (
        db.query(DBPosition)
        .filter(DBPosition.token == token, DBPosition.symbol == pos.symbol.upper())
        .one_or_none()
    )
    if existing:
        existing.qty = pos.qty
        if pos.avg_cost is not None:
            existing.avg_cost = pos.avg_cost
        if pos.name is not None:
            existing.name = pos.name
    else:
        db.add(
            DBPosition(
                token=token,
                symbol=pos.symbol.upper(),
                qty=pos.qty,
                avg_cost=float(pos.avg_cost or 0.0),
                name=pos.name,
            )
        )
    db.commit()
    return get_portfolio_for_token(token, db)


@app.get("/api/portfolio")
def api_portfolio(token: str = Depends(_token_from_header), db: Session = Depends(get_db)):
    summary = portfolio_summary(token, db)
    return {
        "value": summary.total_value,
        "dayChange": 0.0,  # placeholder without intraday baseline
        "dayPct": 0.0,
    }


@app.get("/api/allocation")
def api_allocation(token: str = Depends(_token_from_header), db: Session = Depends(get_db)):
    positions = get_portfolio_for_token(token, db)
    return [{"name": p.symbol, "value": round(p.weight or 0.0, 2)} for p in positions]


@app.get("/api/timelines")
def api_timelines(token: str = Depends(_token_from_header)):
    return []


@app.get("/api/politicians")
def api_politicians(token: str = Depends(_token_from_header)):
    return []


@app.get("/api/alerts")
def api_alerts(token: str = Depends(_token_from_header)):
    return []


@app.post("/api/alerts")
def api_create_alert(payload: dict, token: str = Depends(_token_from_header)):
    return {"ok": True, "alert": payload}


@app.get("/api/reports")
def api_reports(token: str = Depends(_token_from_header)):
    return []
