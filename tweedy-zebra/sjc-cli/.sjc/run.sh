#!/bin/bash
DIR=$(git rev-parse --show-toplevel)
. $DIR/vars.sh
image_exists=`docker images | grep "\s$branch\s" | grep "\b$app_imagename\s"`
if [ "$image_exists" == "" ]; then
	$DIR/sjc build
fi
$DIR/docker.db.run
$DIR/docker.db.load_data
if [ "$1" == '--hard' ]; then
	$DIR/docker.app.runHard
else
	$DIR/docker.app.run
fi
docker ps
