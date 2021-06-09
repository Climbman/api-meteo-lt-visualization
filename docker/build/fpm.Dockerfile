FROM php:7.4.19-fpm-buster

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get -y update --fix-missing && \
    apt-get upgrade -y && \
    apt-get --no-install-recommends install -y apt-utils

RUN apt-get -y update && \
    apt-get -y --no-install-recommends install --fix-missing \
    vim \
    wget \
    dialog \
    apt-utils \
    build-essential \
    git \
    curl \
    zip \
    openssl \
    libcurl4 \
    libcurl4-openssl-dev \
    zlib1g-dev \
    libzip-dev \
    libicu-dev \
    libonig-dev && \
    rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_mysql && \
    docker-php-ext-install mysqli && \
    docker-php-ext-install curl && \
    docker-php-ext-install tokenizer && \
    docker-php-ext-install json && \
    docker-php-ext-install zip && \
    docker-php-ext-install -j$(nproc) intl && \
    docker-php-ext-install mbstring && \
    docker-php-ext-install gettext && \
    docker-php-ext-install exif

RUN pecl install xdebug-2.8.0 && \
    docker-php-ext-enable xdebug


RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN mkdir -p /srv/app
WORKDIR /srv/app

RUN usermod --uid 1000 www-data && groupmod --gid 1000 www-data
