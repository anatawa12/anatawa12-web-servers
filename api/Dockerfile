# syntax=docker.io/docker/dockerfile:1.3.0

FROM php:8-apache

COPY --chown=www-data:www-data src /var/www/html/
RUN mv \
    /etc/apache2/mods-available/rewrite.load \
    /etc/apache2/mods-enabled
