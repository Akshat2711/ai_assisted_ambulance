FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1
WORKDIR /app

# Copy requirements from backend folder
COPY backend/requirements.txt backend/requirements.txt

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code preserving structure
COPY backend backend

EXPOSE 8080

CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
