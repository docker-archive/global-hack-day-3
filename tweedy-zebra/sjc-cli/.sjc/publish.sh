#!/bin/bash
DIR=$(git rev-parse --show-toplevel)
. $DIR/vars.sh
if [ -z "$1" ]; then
	thebranch=$branch
	thecontainer=$app_containername
else
	thebranch=$1
	thecontainer=${app_containername/$branch/$1}
fi
containerport=`docker port $thecontainer | grep -o "\d\+$"`

#node $DIR/.sjc/tunnels.js "publish" $appname $thecontainer $thebranch $containerport
#ngrok http -log=stdout $thebranch.ngrok.highlandfarms.dev:$containerport > ./logz/$appname.$thebranch.ngrok.log &

open http://127.0.0.1:4040/status
ngrok http $thebranch.ngrok.highlandfarms.dev:$containerport
