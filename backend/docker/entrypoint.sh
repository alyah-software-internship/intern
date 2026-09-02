#!/bin/sh

set -e

echo "========================================"
echo "Starting Laravel application..."
echo "========================================"

cd /var/www/html

# Create required Laravel directories
mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

# Set permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

echo "Laravel directories ready."

# Clear old cached configuration
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

echo "Laravel cache cleared."

# Generate optimized configuration
php artisan config:cache || true

echo "Laravel configuration cached."

echo "========================================"
echo "Laravel application ready."
echo "Starting server..."
echo "Port: ${PORT:-10000}"
echo "========================================"

# Start Laravel server
exec php artisan serve \
    --host=0.0.0.0 \
    --port="${PORT:-10000}"