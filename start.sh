#!/bin/sh
set -e

# Railway/Render pass $PORT environment variable (e.g. 8080, 80, 3000, 10000)
LISTEN_PORT="${PORT:-80}"

echo "Configuring Nginx to listen on port: $LISTEN_PORT"
sed -i "s/listen 80;/listen $LISTEN_PORT;/g" /etc/nginx/conf.d/default.conf

mkdir -p /var/log/supervisor

echo "Starting supervisor daemon (Backend + Frontend + Nginx)..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
