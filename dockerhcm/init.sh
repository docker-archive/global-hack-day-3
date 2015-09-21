#!/bin/sh

cd /
./minimonitor &

/build/nginx/sbin/nginx -c /nginx.conf 
