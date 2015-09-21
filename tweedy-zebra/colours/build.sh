#!/bin/bash

DIR=$(git rev-parse --show-toplevel)
source $DIR/vars.sh

for service in $services;
do
    bash $DIR/services/$service/build.sh $service
done
