#!/bin/bash

sudo -H DOCKER_HOST="$DOCKER_HOST" DOCKER_MACHINE_NAME="$DOCKER_MACHINE_NAME" DOCKER_TLS_VERIFY="$DOCKER_TLS_VERIFY" DOCKER_CERT_PATH="$DOCKER_CERT_PATH" node reverseproxy.js

<<<<<<< HEAD
=======
bash $DIR/stop.sh

docker run -d -p 80:8080 \
	--name reverseproxy \
	-v $DIR/reverseproxy.js:/usr/src/app/reverseproxy.js \
	-v $DIR/logz:/logz \
	--net=host \
	sean9999/orchestra-reverse-proxy
>>>>>>> 9f2f29f3dc7561adc08c2e95a92025e0bd21aa10
