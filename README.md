## Stock Portfolio Tracker

## Team Members

| Name     | NetID   | Role                             |
| -------- | ------- | -------------------------------- |
| Uzair    | uzairs2 | Backend, API, Docker, Testing    |
| Youngjin | ys62    | Frontend, UI, Data Visualization |


## About Stock PortFolio Tracker

Stock Portfolio Tracker is a full-stack web application that allows users to create, manage, and analyze stock portfolios using real-time market data and sentiment context.

A README, along with a repository license and contribution guidelines, helps communicate expectations, usage, and project structure to contributors and users. This file serves as the primary entry point for understanding the project.

---

## What the Portfolio Does

Stock Portfolio Tracker enables users to:

- Create token-based portfolio sessions (no login required)
- Add, update, and remove stock positions
- Fetch and cache real-time stock prices
- Visualize portfolio allocation and composition
- Compare portfolios against public figures
- Explore sentiment context using NLP techniques

The application integrates a React frontend with a FastAPI backend and a relational database.

---

## Differences Between Our Stock Portfolio and Others

Unlike traditional portfolio trackers, this project includes:

- **Token-based sessions**  
  No logins or accounts required — users receive a token that persists their portfolio across sessions.

- **Alternative timelines**  
  Users can explore hypothetical scenarios and compare outcomes over time.

- **Public figure comparisons**  
  Portfolio allocations and performance can be compared against politicians and other public figures.

- **Sentiment-aware insights**  
  Social sentiment (via NLP) provides contextual insight into portfolio movements.

- **Lightweight & modular architecture**  
  Designed for extensibility with clean API boundaries and test coverage.

## Why This Portfolio Is Useful

This project demonstrates:

- End-to-end full-stack development
- RESTful API design
- Frontend-backend integration
- Data visualization
- Automated testing and coverage
- Practical use of AI/NLP (sentiment analysis)
- Software engineering best practices

It is useful both as a functional portfolio analysis tool and as a learning reference for modern web development workflows.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Python 3.10+
- Git

---

### Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
