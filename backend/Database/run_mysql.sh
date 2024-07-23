#!/bin/bash

mysql -h 172.21.0.3 -u root -p"$MYSQL_ROOT_PASSWORD" < /Database/triggers.sql