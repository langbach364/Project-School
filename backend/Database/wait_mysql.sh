#!/bin/bash

IP="172.21.0.3"
PORT="3306"
while ! ./wait-for-it.sh $IP:$PORT; do
    echo "Cổng $PORT từ địa chỉ $IP chưa mở..."
    sleep 15
done

echo "Cổng mysql từ $IP:$PORT đã mở có thể chạy các triggers và thêm dữ liệu vào database"

chmod +x ./run_mysql.sh
./run_mysql.sh
