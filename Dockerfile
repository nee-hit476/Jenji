# syntax=docker/dockerfile:1

# Use official Python base image
ARG PYTHON_VERSION=3.13
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
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Create an unprivileged user
ARG UID=10001
RUN adduser --disabled-password --gecos "" --uid ${UID} appuser || true

# Copy backend source code
COPY . /app

# Switch to non-root user
USER appuser

# Expose the backend port (Flask-SocketIO default)
EXPOSE 8080

# Run with Gunicorn + Eventlet (for WebSocket support)
CMD ["gunicorn", "-k", "eventlet", "-w", "1", "src.api.app:app", "-b", "0.0.0.0:8080"]
