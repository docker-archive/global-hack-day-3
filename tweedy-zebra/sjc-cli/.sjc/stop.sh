#!/bin/bash
DIR=$(git rev-parse --show-toplevel)
. $DIR/vars.sh
if [ -z "$1" ]; then
	docker stop $app_containername
	docker stop $db_containername
elif [ "$1" == "--all" ]; then
	docker stop $(docker ps -q)
else
	docker stop ${app_containername/$branch/$1}
	docker stop ${db_containername/$branch/$1}
fi
