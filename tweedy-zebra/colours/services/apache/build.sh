#!/bin/bash

source $(git rev-parse --show-toplevel)/vars.sh

servicename=$1

docker build -t $imagebase-$servicename:$branch $DIR/services/$servicename
