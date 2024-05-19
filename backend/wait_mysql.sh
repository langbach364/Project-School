#!/bin/bash

IP="172.21.0.3"
PORT="3306"
while ! ./wait-for-it.sh $IP:$PORT; do
    echo "Cổng $PORT từ địa chỉ $IP chưa mở..."
    sleep 2
done

echo "Cổng mysql từ $IP:$PORT đã mơ có thể chạy mã nguồn"

chmod +x ./start.sh
./start.sh
