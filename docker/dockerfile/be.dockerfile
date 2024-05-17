FROM golang:latest

# Chuyển đến thư mục trong container
WORKDIR /Documents/backend

# Sao chép toàn bộ thư mục gốc của server docker vào trong container theo đường dẫn /Documents/backend
COPY ./backend .

# Chuyển đến thư mục backend
WORKDIR /Documents/backend/

# Sao chép file start.sh vào container
COPY ./backend/start.sh .

# Thay đổi quyền truy cập của file start.sh để có thể thực thi
RUN chmod +x ./start.sh

# Chuyển đến thư mục Connect_database
WORKDIR /Documents/backend/Connect_database

# Sao chép toàn bộ nội dung của thư mục Connect_database vào container
COPY ./backend/Connect_database/. .

# Chạy lệnh go mod tidy để dọn dẹp các module không cần thiết
RUN go mod tidy

# Chuyển đến thư mục System
WORKDIR /Documents/backend/System

# Sao chép toàn bộ nội dung của thư mục System vào container
COPY ./backend/System/. .

# Chạy lệnh go mod tidy để dọn dẹp các module không cần thiết
RUN go mod tidy

# Chuyển đến thư mục backend
WORKDIR /Documents/backend

# Thiết lập lệnh CMD để chạy file start.sh khi container khởi động
CMD ["./start.sh"]
