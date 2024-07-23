#!/bin/bash

IP="172.21.0.3"
PORT="3306"
while ! ./wait-for-it.sh $IP:$PORT; do
    echo "Cổng $PORT từ địa chỉ $IP chưa mở..."
    sleep 15
done

echo "Cổng mysql từ $IP:$PORT đã mở có thể chạy mã nguồn"

chmod +x ./start_sources.sh
./start_sources.sh
