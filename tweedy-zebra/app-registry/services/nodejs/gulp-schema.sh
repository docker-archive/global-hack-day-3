#!/bin/bash

DIR="$(git rev-parse --show-toplevel)"
source $DIR/vars.sh
servicename=nodejs
containername="${project}-${appname}-${branch}-${servicename}"

docker exec $containername /usr/local/bin/gulp schema
