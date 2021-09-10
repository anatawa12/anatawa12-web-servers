FROM nginx:stable

RUN rm /etc/nginx/conf.d/*
COPY conf.d /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/nginx.conf
COPY src /etc/nginx/html/
