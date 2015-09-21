#!/bin/bash

DIR=$(git rev-parse --show-toplevel)
source $DIR/vars.sh

for service in $services; do
    docker stop $project-$appslug-$branch-$service && docker rm $project-$appslug-$branch-$service
done
