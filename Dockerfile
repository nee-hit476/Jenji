# syntax=docker/dockerfile:1

# Use official Python base image
ARG PYTHON_VERSION=3.11
FROM python:${PYTHON_VERSION}-slim AS backend

# Environment variables for reliability
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies required by some Python packages (like OpenCV)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install --no-cache-dir -r /app/requirements.txt

# Add an unprivileged user for safer runtime
ARG UID=10001
RUN adduser --disabled-password --gecos "" --uid ${UID} appuser || true

# Copy only the API source to keep the image small and avoid bringing frontend/tests into the image
# We place the API under /app/src so existing imports like `src.api.live_app` continue to work.
COPY src/api /app/src/api

# Ensure the top-level `src` package exists (helps imports in some Python setups)
RUN mkdir -p /app/src \
    && touch /app/src/__init__.py \
    && chown -R appuser:appuser /app/src

# Create a directory for model files (user can mount their model here)
RUN mkdir -p /app/model && chown -R appuser:appuser /app/model

# Switch to non-root user
USER appuser

# Expose the backend port (configured in Config.PORT)
EXPOSE 8080

# Run with Gunicorn + Eventlet (for WebSocket support).
# Note: Gunicorn will import create_app in `src.api.live_app` which starts
# model loading in a background thread. We bind to 0.0.0.0:8080.
CMD ["gunicorn", "-k", "eventlet", "-w", "1", "src.api.live_app:app", "-b", "0.0.0.0:8080"]
