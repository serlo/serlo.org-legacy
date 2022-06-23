FROM php:7.0.33-fpm as base
RUN apt-get update -y
RUN apt-get install -y gettext locales libicu-dev
RUN docker-php-ext-install pdo_mysql mysqli gettext intl
RUN pecl channel-update pecl.php.net
RUN yes no | pecl install apcu_bc
RUN pecl install redis
RUN docker-php-ext-enable redis
RUN sed -ie 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/g' /etc/locale.gen
RUN sed -ie 's/# en_GB.UTF-8 UTF-8/en_GB.UTF-8 UTF-8/g' /etc/locale.gen
RUN sed -ie 's/# de_DE.UTF-8 UTF-8/de_DE.UTF-8 UTF-8/g' /etc/locale.gen
RUN sed -ie 's/# hi_IN UTF-8/hi_IN UTF-8/g' /etc/locale.gen
RUN sed -ie 's/# ta_IN UTF-8/ta_IN UTF-8/g' /etc/locale.gen
RUN sed -ie 's/# fr_FR.UTF-8 UTF-8/fr_FR.UTF-8 UTF-8/g' /etc/locale.gen
RUN sed -ie 's/# es_ES.UTF-8 UTF-8/es_ES.UTF-8 UTF-8/g' /etc/locale.gen
RUN DEBIAN_FRONTEND=noninteractive dpkg-reconfigure locales
WORKDIR /usr/local/apache2/htdocs
COPY docker/php/php.ini-custom "$PHP_INI_DIR/php.ini-custom"
RUN cat "$PHP_INI_DIR/php.ini-custom" >> "$PHP_INI_DIR/php.ini"
RUN cat "$PHP_INI_DIR/php.ini-custom" >> "$PHP_INI_DIR/php.ini-development"
RUN cat "$PHP_INI_DIR/php.ini-custom" >> "$PHP_INI_DIR/php.ini-production"
RUN cp "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

RUN mkdir -p src/data/DoctrineORMModule/Proxy src/logs
RUN chmod 777 -R src/data src/logs

FROM composer:2 as dependencies
WORKDIR /app
COPY src/module src/module
COPY composer.json .
COPY composer.lock .
RUN composer install --no-dev --optimize-autoloader

FROM base as release
WORKDIR /usr/local/apache2/htdocs
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY --from=dependencies /app/src/vendor src/vendor
COPY package.json package.json
COPY bin bin
COPY src/config src/config
RUN rm -f definitions.local.php
COPY src/lang src/lang
COPY src/module src/module
COPY src/public src/public
COPY src/init_autoloader.php src/init_autoloader.php
RUN bin/build.sh
EXPOSE 9000
