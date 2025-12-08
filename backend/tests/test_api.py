import os
import sys
from pathlib import Path

from fastapi.testclient import TestClient

# Make sure backend directory (where main.py lives) is on sys.path
ROOT = Path(__file__).resolve().parents[1]  # this is the backend/ folder
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from main import app  # now this should work

client = TestClient(app)


def test_health_root():
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert "time" in body


def test_create_portfolio_and_get_summary():
    # 1) create empty portfolio
    r = client.post("/portfolio", json=None)
    assert r.status_code == 200
    token = r.json()["token"]
    assert token

    # 2) replace positions with PUT
    positions = [
        {"symbol": "AAPL", "qty": 2, "avg_cost": 170.0, "name": "Apple Inc."},
        {"symbol": "MSFT", "qty": 1, "avg_cost": 360.0},
    ]
    r = client.put(f"/portfolio/{token}", json=positions)
    assert r.status_code == 200
    body = r.json()
    assert isinstance(body, list)
    assert len(body) == 2
    # each position should have price and market_value
    for pos in body:
        assert "price" in pos
        assert "market_value" in pos

    # 3) GET /portfolio/{token}/summary
    r = client.get(f"/portfolio/{token}/summary")
    assert r.status_code == 200
    summary = r.json()
    assert "total_cost" in summary
    assert "total_value" in summary
    assert "pnl" in summary
    assert "pnl_pct" in summary
    assert isinstance(summary["positions"], list)
    assert len(summary["positions"]) == 2


def test_quote_endpoint():
    r = client.get("/quote/AAPL")
    assert r.status_code == 200
    body = r.json()
    assert body["symbol"] == "AAPL"
    assert "price" in body


def test_sentiment():
    r = client.post("/sentiment", json={"text": "I love gains but hate losses."})
    assert r.status_code == 200
    body = r.json()
    assert "compound" in body
    assert "pos" in body
    assert "neu" in body
    assert "neg" in body


def _make_token():
    # helper to create a token via /portfolio
    r = client.post("/portfolio", json=None)
    assert r.status_code == 200
    return r.json()["token"]


def test_api_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"


def test_api_positions_and_allocation_and_portfolio():
    token = _make_token()

    headers = {"x-pt-token": token}

    # upsert a position via /api/positions (POST)
    payload = {"symbol": "TSLA", "qty": 3, "avgCost": 200.0, "name": "Tesla Inc."}
    r = client.post("/api/positions", json=payload, headers=headers)
    assert r.status_code == 200
    positions = r.json()
    assert isinstance(positions, list)
    assert len(positions) == 1
    assert positions[0]["symbol"] == "TSLA"

    # GET /api/positions
    r = client.get("/api/positions", headers=headers)
    assert r.status_code == 200
    positions = r.json()
    assert len(positions) == 1
    assert positions[0]["symbol"] == "TSLA"

    # GET /api/allocation
    r = client.get("/api/allocation", headers=headers)
    assert r.status_code == 200
    alloc = r.json()
    assert isinstance(alloc, list)
    assert len(alloc) == 1
    assert alloc[0]["name"] == "TSLA"
    assert "value" in alloc[0]

    # GET /api/portfolio
    r = client.get("/api/portfolio", headers=headers)
    assert r.status_code == 200
    body = r.json()
    assert "value" in body
    assert "dayChange" in body
    assert "dayPct" in body


def test_api_alerts_and_reports_and_timeline_and_politicians():
    token = _make_token()
    headers = {"x-pt-token": token}

    # timelines
    r = client.get("/api/timelines", headers=headers)
    assert r.status_code == 200
    assert r.json() == []

    # politicians
    r = client.get("/api/politicians", headers=headers)
    assert r.status_code == 200
    assert r.json() == []

    # alerts (GET)
    r = client.get("/api/alerts", headers=headers)
    assert r.status_code == 200
    assert r.json() == []

    # alerts (POST)
    payload = {"symbol": "AAPL", "rule": "price > 200"}
    r = client.post("/api/alerts", json=payload, headers=headers)
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True
    assert body["alert"] == payload

    # reports
    r = client.get("/api/reports", headers=headers)
    assert r.status_code == 200
    assert r.json() == []
