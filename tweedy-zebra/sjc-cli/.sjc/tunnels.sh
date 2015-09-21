#!/bin/bash 
DIR="$(git rev-parse --show-toplevel)"
. $DIR/vars.sh
echo 'not supported right now'
exit 1;
if [ -z "$2" ]; then
	thebranch=$branch
	thecontainer=$app_containername
else
	thebranch=$2
	thecontainer=${app_containername/$branch/$2}
fi
if [ -z "$1" ]; then
	action=list
else
	action=$1
fi
containerport=`docker port $thecontainer | grep -o "\d\+$"`
node --harmony $DIR/.sjc/tunnels.js $action $appname $thecontainer $thebranch $containerport
