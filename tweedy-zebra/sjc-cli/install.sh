#!/bin/bash

sudo -v

sudo -H mkdir -p ~/.sjc/cli
sudo -H rm -rvf ~/.sjc/cli

cd ~/.sjc

sudo -H git clone https://github.com/stjosephcontent/sjc-cli.git cli

sudo chown -R $USER cli

cd cli

sudo -H npm install n -g
sudo -H n latest

sudo -H npm install
sudo -H npm link

echo "ok,orchestra is up and running. try 'sjc up'"

