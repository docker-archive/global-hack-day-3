#!/bin/bash
DIR="$(git rev-parse --show-toplevel)"
. $DIR/vars.sh
if [ -z "$1" ]; then
	thebranch=$branch
	thecontainer=$app_containername
else
	thebranch=$1
	thecontainer=${app_containername/$branch/$1}
fi
URL="http://$thebranch.highlandfarms.dev:`docker port $thecontainer | grep -o "\d\+$"`"
echo "Docker Image: $app_imagename"
echo "Branch: $thebranch"
echo "URL: $URL"/debug.php
open $URL/debug.php
