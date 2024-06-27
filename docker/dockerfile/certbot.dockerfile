FROM certbot/certbot

WORKDIR /Documents/backend/
COPY ./backend/wait_certbot.sh .

RUN chmod +x wait_certbot.sh

WORKDIR /Documents/backend
CMD ["./wait_certbot.sh"]
