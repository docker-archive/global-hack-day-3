#!/bin/sh
#

curl -sSL https://get.docker.com/ | sh
echo "Initializing dockerbox"
do_docker_install
service docker stop
killall -9 docker
echo $1' registry' >> /etc/hosts
docker daemon -H tcp://0.0.0.0:2375 --insecure-registry registry:5000&