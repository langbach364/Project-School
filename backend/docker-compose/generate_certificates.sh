#!/bin/bash

# Thư mục chứa chứng chỉ
CERT_DIR="/etc/nginx/certificates"

# Tên file chứng chỉ và khóa
CERT_FILE="cert.pem"
KEY_FILE="key.pem"

# Tạo thư mục chứa chứng chỉ nếu chưa tồn tại
mkdir -p $CERT_DIR

# Tạo chứng chỉ tự ký
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $CERT_DIR/$KEY_FILE -out $CERT_DIR/$CERT_FILE -subj "/C=VN/emailAddress=bachlang364@gmail.com"

echo "Chứng chỉ và khóa đã được tạo tại $CERT_DIR"
