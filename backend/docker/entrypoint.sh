#!/bin/sh
set -e

cd /var/www/html

# Install Composer dependencies if vendor directory is missing (e.g. due to a bind mount)
if [ ! -f vendor/autoload.php ]; then
    echo "vendor/autoload.php not found, running composer install..."
    composer install --no-dev --optimize-autoloader --no-interaction
fi

# Generate APP_KEY if not provided
if [ -z "$APP_KEY" ]; then
    echo "APP_KEY not set, generating one..."
    export APP_KEY="base64:$(head -c 32 /dev/urandom | base64)"
fi

# Ensure storage directories exist (volume mount may be empty)
mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache
mkdir -p storage/logs storage/app
chown -R www-data:www-data storage bootstrap/cache

# Run migrations
su -s /bin/sh -c "APP_KEY=$APP_KEY php artisan migrate --force --no-interaction" www-data

exec su -s /bin/sh -c "APP_KEY=$APP_KEY exec $*" www-data
