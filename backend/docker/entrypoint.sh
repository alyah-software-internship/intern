#!/bin/sh

set -e

echo "Starting Laravel application..."

# Generate nginx configuration using Render's PORT
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Make sure Laravel directories are writable
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache

chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache

# Clear old Laravel caches
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

echo "Laravel application ready."

exec "$@"