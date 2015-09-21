#!/bin/bash

DIR="$(git rev-parse --show-toplevel)"

sudo -v

mkdir -p ~/.sjc
sudo rm -rvf ~/.sjc/reverseproxy
cd ~/.sjc
sudo chown -R $USER .
git clone https://github.com/stjosephcontent/orchestra-reverse-proxy.git ~/.sjc/reverseproxy
cd ~/.sjc/reverseproxy/
sudo npm install -g pm2
sudo -H npm install
