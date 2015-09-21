#!/bin/bash

DIR=$(git rev-parse --show-toplevel)
source $DIR/vars.sh

for service in $services;
do
    docker rm $imagebase-$service:$branch 2> /dev/null
    bash $DIR/services/$service/build.sh $service
done
