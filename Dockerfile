# Multi-stage build for Fullstack Fireflies Clone (Frontend + Backend in one container)

# ----------------------------------------------------
# Stage 1: Build Frontend (Next.js)
# ----------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL=""
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ .
RUN npm run build

# ----------------------------------------------------
# Stage 2: Final Production Container
# ----------------------------------------------------
FROM python:3.11-slim

WORKDIR /app

# Install Node.js 20, Nginx, and supervisor
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    nginx \
    supervisor \
    ca-certificates \
    gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Python backend dependencies
COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend code & seed SQLite database
COPY backend/ /app/backend/
WORKDIR /app/backend
RUN python -m app.seed

# Copy frontend code from frontend-builder
WORKDIR /app/frontend
COPY --from=frontend-builder /app/frontend/package.json ./
COPY --from=frontend-builder /app/frontend/node_modules ./node_modules
COPY --from=frontend-builder /app/frontend/.next ./.next
COPY --from=frontend-builder /app/frontend/public ./public

# Setup Nginx configuration to reverse proxy /api to FastAPI (8000) and all else to Next.js (3000)
RUN rm /etc/nginx/sites-enabled/default
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Setup Supervisord configuration to manage backend, frontend, and nginx
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Startup script to handle dynamic PORT variable (from Railway / Render / Koyeb)
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

WORKDIR /app
EXPOSE 80 3000 8000

CMD ["/app/start.sh"]
