#!/bin/bash

url="http://127.0.0.1:4040/inspect/http"
output_file="ngrok_inspect.txt"

curl -s "$url" > "$output_file"
echo "Đã xuất nội dung từ $url vào tệp $output_file"
