#!/bin/bash
DIR="$(git rev-parse --show-toplevel)"
. $DIR/vars.sh

#	stop and delete containers
docker stop $app_containername 2> /dev/null
docker stop $db_containername 2> /dev/null
docker rm $app_containername 2> /dev/null
docker rm $db_containername 2> /dev/null

#	set permissions on source code
find code -type f -print0 | xargs -0 chmod 644

#	build
docker build -t $db_imagename:$branch -f $DIR/docker.db.file $DIR
docker build -t $app_imagename:$branch -f $DIR/docker.app.file $DIR
