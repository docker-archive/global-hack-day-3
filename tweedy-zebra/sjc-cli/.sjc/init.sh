#!/bin/bash
DIR="$(git rev-parse --show-toplevel)"
. $DIR/vars.sh

echo `which ngrok`
echo `which node`
echo `which docker`
echo `which boot2docker`

npm install ngrok-daemon --save