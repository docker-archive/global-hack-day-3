#!/bin/bash

DIR="$(git rev-parse --show-toplevel)"
source $DIR/vars.sh

#   stop all services

echo "stopping services..."
for servicename in $services; do
    docker stop ${project}-${appname}-${branch}-${servicename}
    docker rm ${project}-${appname}-${branch}-${servicename}
done

echo "services are stopped."