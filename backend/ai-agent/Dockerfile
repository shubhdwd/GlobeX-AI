# ─────────────────────────────────────────────────────────────────────────────
# GlobeX AI — Python Agent Service Dockerfile
# ─────────────────────────────────────────────────────────────────────────────

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (needed for compiling certain python packages like chromadb/pydantic if wheel not present)
RUN apk add --no-cache build-essential || apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the service code
COPY . .

# Create the database directory for sqlite/chroma
RUN mkdir -p database

# Expose port
EXPOSE 8000

# Start FastAPI application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
