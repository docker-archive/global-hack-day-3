#!/bin/bash

##############################################################################
#                              Single host
##############################################################################

################# step 1: create or start docker machine ##########
echo "step 1: create or start docker machine"

# DOCKER_MACHINE_NAME=dm-single-host
#DOCKER_MACHINE_NAME=dm-single-host1

# check if exists
docker-machine status ${DOCKER_MACHINE_NAME}

if [[ $? != 0 ]]; then
    # if not exists, then create new machine
    echo "Create new machine"
    docker-machine create \
        -d virtualbox \
        ${DOCKER_MACHINE_NAME}
else
    # if exists, then start machine
    echo "Start machine"
    docker-machine start ${DOCKER_MACHINE_NAME}
fi


################# step 2: get docker-machine environment ##########
echo "step 2: get docker-machine environment"
eval $(docker-machine env ${DOCKER_MACHINE_NAME})


################# step 3: build docker image ##########
echo "step 3: build docker image"

cd ${DOCKER_BUILD_PATH}
docker build --tag=${DOCKER_BUILD_TAG} .


################# step 4: docker compose up ##########
echo "step 4: docker compose up"

cd ${DOCKER_BUILD_PATH}
docker-compose build
docker-compose up -d

echo "done!"


