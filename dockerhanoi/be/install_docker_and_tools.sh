#!/bin/bash

# install docker
wget -qO- https://get.docker.com/ | sh
# sudo usermod -a -G docker `whoami`


# install docker-compose
sudo wget -q https://github.com/docker/compose/releases/download/1.4.0/docker-compose-`uname -s`-`uname -m` -O /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose


# install docker-machine
sudo wget -q https://github.com/docker/machine/releases/download/v0.4.0/docker-machine_linux-amd64 -O /usr/local/bin/docker-machine
sudo chmod +x /usr/local/bin/docker-machine


# check version
sudo docker version
sudo docker-machine --version
sudo docker-compose --version
