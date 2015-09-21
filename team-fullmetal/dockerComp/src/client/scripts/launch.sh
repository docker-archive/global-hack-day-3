#!/bin/bash

END=$1

docker pull arcolife/docker_comp

for i in $(seq 1 $END);
do
    docker run -it -d arcolife/docker_comp    
done

# docker ps > containers_details
# cd scripts/
# python read_container_details.py
# cd ..

docker inspect $(docker ps -q | head -n $END) > container_info.json
# docker inspect $(docker ps  | grep arcolife/docker_comp | awk -F' ' '{print $1}') > container_info.json

curl -H "Content-type: application/json" -X POST http://$DC_HOST:$DC_PORT/get_details/ -d @container_info.json

echo $END" containers have been deployed.."
