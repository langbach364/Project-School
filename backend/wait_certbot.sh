#!/bin/bash

CERTBOT_DONE_FILE="/tmp/certbot/done"

echo "Đang chờ Certbot..."
while [ ! -f "$CERTBOT_DONE_FILE" ]; do
  sleep 1
done

echo "Đã hoàn thành Certbot... bắt đầu khởi động nginx" 
exec "$@"
