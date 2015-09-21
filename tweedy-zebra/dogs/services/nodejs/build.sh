#!/bin/bash

DIR=$(git rev-parse --show-toplevel)
source $DIR/vars.sh

servicename=$1

docker build -t $imagebase-$servicename:$branch $DIR/services/$servicename
