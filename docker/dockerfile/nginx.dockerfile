# Sử dụng image Nginx cơ bản
FROM nginx:latest

# Sao chép file cấu hình Nginx vào container
WORKDIR /etc/nginx
COPY ./nginx.conf ./nginx.conf

# Sao chép script tạo chứng chỉ vào container
COPY ./generate_certificates.sh ./generate_certificates.sh

# Đảm bảo script có quyền thực thi
RUN chmod +x ./generate_certificates.sh

# Lệnh để chạy script tạo chứng chỉ và khởi động Nginx
CMD ["/bin/bash", "-c", "/etc/nginx/generate_certificates.sh && nginx -g 'daemon off;'"]
