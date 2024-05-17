FROM nginx:latest

WORKDIR /etc/nginx
COPY ./nginx.conf ./nginx.conf

COPY ./generate_certificates.sh ./generate_certificates.sh
RUN chmod +x ./generate_certificates.sh

CMD ["/bin/bash", "-c", "/etc/nginx/generate_certificates.sh && nginx -g 'daemon off;'"]
