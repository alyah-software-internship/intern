#!/bin/sh

set -eu

echo "========================================"
echo "Starting Laravel application..."
echo "========================================"

cd /var/www/html

if [ -z "${APP_KEY:-}" ]; then
    echo "ERROR: APP_KEY is not configured. Add APP_KEY to the Render environment variables." >&2
    exit 1
fi

case "${PORT:-10000}" in
    ''|*[!0-9]*)
        echo "ERROR: PORT must be a numeric port." >&2
        exit 1
        ;;
esac

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
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "Laravel cache cleared."

# Generate optimized configuration
php artisan config:cache

echo "Laravel configuration cached."

echo "========================================"
echo "Laravel application ready."
echo "Starting server..."
echo "Port: ${PORT:-10000}"
echo "========================================"

# Start Laravel using PHP's native server so the container tracks one process.
exec php -S "0.0.0.0:${PORT:-10000}" -t public