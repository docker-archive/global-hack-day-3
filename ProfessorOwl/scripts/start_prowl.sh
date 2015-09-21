#!/usr/bin/env bash

if [[ -z "$DO_PAT" ]]; then
  echo 'DO_PAT environment var not found!'
  echo 'You must provide Digital Ocean Personal Access Token!'
  exit 1
fi

DOCKER_MACHINE=$(which docker-machine)

if [[ -z "$DOCKER_MACHINE" ]]; then
  echo 'docker-machine not found!'
  echo 'Download it from https://github.com/docker/machine/releases'
  exit 1
fi

$DOCKER_MACHINE  create prowl \
        --driver digitalocean \
        --digitalocean-access-token $DO_PAT \
        --digitalocean-region "sfo1" \
        --digitalocean-size "1gb"

PROWL_MACHINE_RESULT=$?

if [[ ! $PROWL_MACHINE_RESULT -eq 0 ]]; then
  echo 'Failed to create Professor Owl droplet, check Digital Ocean for system outages!'
  exit 1
fi

cat <<SETUPPROWLUSER
Congratulation you have created the Professor Owl machine! You now need to create
your dedicated user account. Copy and paste the following instructions:

$DOCKER_MACHINE ssh prowl
useradd prowl -m -s /bin/bash
adduser prowl docker
passwd prowl
apt-get update && apt-get install tmux curl
mkdir /root/stage
cd /root/stage
curl -LO https://github.com/yudai/gotty/releases/download/pre-release/linux_amd64.tar.gz
mv gotty /usr/local/bin
chown root:root /usr/local/bin/gotty
chmod a+x /usr/local/bin/gotty
su -l prowl
git clone https://github.com/booyaa/ProfessorOwl.git
cd ProfessorOwl
screen -c professorowl-screenrc
SETUPPROWLUSER
