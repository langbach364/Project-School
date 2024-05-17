# Sử dụng image MySQL cơ bản
FROM mysql:latest

# Đặt biến môi trường
ENV MYSQL_ROOT_PASSWORD=@ztegc4df9f4e
ENV MYSQL_DEFAULT_AUTHENTICATION_PLUGIN=mysql_native_password

# Sao chép file SQL vào container
COPY ./backend/Database/SQLQuery_1.sql /docker-entrypoint-initdb.d/init.sql

# Lệnh để khởi động MySQL với file init
CMD ["--init-file=/docker-entrypoint-initdb.d/init.sql"]
