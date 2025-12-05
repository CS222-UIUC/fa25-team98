# Simple backend Dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps (psycopg2-binary works without build tools, so keep minimal)
RUN pip install --no-cache-dir --upgrade pip

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Default envs (override in runtime)
ENV HOST=0.0.0.0 \
    PORT=8000 \
    ALPHAVANTAGE_API_KEY="" \
    DATABASE_URL="sqlite:///./app.db"

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
