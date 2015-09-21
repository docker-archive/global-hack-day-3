#!/bin/bash

DIR="$(git rev-parse --show-toplevel)"
source $DIR/vars.sh

#   run all services, but wait 5 seconds in between to allow linking to work properly

echo "running services..."
for service in $services; do
    bash $DIR/services/$service/run.sh && sleep 5;
done

echo "services are now running"