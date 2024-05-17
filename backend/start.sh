#!/bin/bash

cd ./Connect_database/
echo "Starting sources in Connect_database..."
go run . &

cd ../System/
echo "Starting sources in System..."
go run . &

wait
