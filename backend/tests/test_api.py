import os
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_portfolio_lifecycle():
    # create portfolio with no positions
    r = client.post("/portfolio", json=None)
    assert r.status_code == 200
    token = r.json()["token"]
    assert token

    # replace positions
    positions = [
        {"symbol": "AAPL", "qty": 2, "avg_cost": 170.0, "name": "Apple Inc."},
        {"symbol": "MSFT", "qty": 1, "avg_cost": 360.0},
    ]
    r = client.put(f"/portfolio/{token}", json=positions)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) == 2

    # get summary
    r = client.get(f"/portfolio/{token}/summary")
    assert r.status_code == 200
    summary = r.json()
    assert "total_cost" in summary and "total_value" in summary and "positions" in summary


def test_sentiment():
    r = client.post("/sentiment", json={"text": "I love gains but hate losses."})
    assert r.status_code == 200
    body = r.json()
    assert "compound" in body
