FROM nginx:latest

WORKDIR /etc/nginx
COPY ./nginx.conf ./nginx.conf

RUN apt-get update && apt-get install -y certbot python3-certbot-nginx

CMD ["nginx", "-g", "daemon off;"]
