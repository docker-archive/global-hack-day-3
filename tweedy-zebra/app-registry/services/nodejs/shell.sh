#!/bin/bash

DIR="$(git rev-parse --show-toplevel)"
source $DIR/vars.sh
servicename=nodejs
containername="${project}-${appname}-${branch}-${servicename}"

#	shell into nodejs
docker exec -it $containername /bin/bash
