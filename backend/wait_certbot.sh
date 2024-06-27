#!/bin/bash
CERTBOT_DONE_FILE="/tmp/certbot/done"
echo "Đang chờ Certbot..."
while [ ! -f "$CERTBOT_DONE_FILE" ]; do
  echo "Chờ đợi..."
  sleep 5
done
echo "Certbot đã hoàn thành. Khởi động Nginx."
exec "$@"
