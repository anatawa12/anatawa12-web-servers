FROM php:8-apache

COPY src /var/www/html/
RUN mv \
    /etc/apache2/mods-available/rewrite.load \
    /etc/apache2/mods-enabled
