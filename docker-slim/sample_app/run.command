#!/usr/bin/env bash

here="$(dirname "$BASH_SOURCE")"
cd $here

eval "$(docker-machine env default)"
docker run -d --name="my_hapi" -p 8000:8000 my/hapi-hello



