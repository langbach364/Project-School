#!/bin/bash

CERT_DIR="/etc/nginx/certificates"
CERT_FILE="cert.pem"
KEY_FILE="key.pem"

mkdir -p $CERT_DIR

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $CERT_DIR/$KEY_FILE -out $CERT_DIR/$CERT_FILE -subj "/C=VN/emailAddress=bachlang364@gmail.com"

echo "Chứng chỉ và khóa đã được tạo tại $CERT_DIR"
