FROM golang:latest

WORKDIR /Documents/backend
COPY ./backend .

WORKDIR /Documents/backend/
COPY ./backend/start.sh .
RUN chmod +x ./start.sh

WORKDIR /Documents/backend/Connect_database
COPY ./backend/Connect_database/. .
RUN go mod tidy

WORKDIR /Documents/backend/System
COPY ./backend/System/. .
RUN go mod tidy

WORKDIR /Documents/backend
CMD ["./start.sh"]
