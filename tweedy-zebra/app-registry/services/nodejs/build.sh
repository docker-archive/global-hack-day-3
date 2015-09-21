#!/bin/bash

DIR="$(git rev-parse --show-toplevel)"
source $DIR/vars.sh
servicename=nodejs

docker build -t sean9999/${project}-${appname}-${servicename}:$branch $DIR/services/$servicename
