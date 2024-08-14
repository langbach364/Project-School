#!/bin/bash

cd ./Connect_database/
echo "Starting sources in Connect_database..."
go run *.go &

cd ../System/
echo "Starting sources in System..."
go run *.go &

wait
