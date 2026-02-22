# Stage 1: Install PHP dependencies
FROM composer:2 AS composer-build

WORKDIR /build
RUN apk add --no-cache postgresql-dev && docker-php-ext-install pdo_pgsql
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist
COPY . ./
RUN composer dump-autoload --optimize

# Stage 2: Final runtime image
FROM php:8.2-cli-alpine

ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions \
    && install-php-extensions pdo_pgsql bcmath

WORKDIR /var/www/html

COPY --from=composer-build /build /var/www/html
RUN rm -f .env

COPY docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh \
    && mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache \
    && mkdir -p storage/logs storage/app \
    && mkdir -p bootstrap/cache

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
