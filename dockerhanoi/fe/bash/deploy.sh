#!/bin/bash

##############################################################################
#                              Swarm cluster
##############################################################################
#export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games"

#export AWS_ACCESS_KEY_ID=access_key
#export AWS_SECRET_ACCESS_KEY=secret_key
#export AWS_VPC_ID=vpc_id
#export AWS_REGION=aws_region
#export AWS_SUBNET_ID=aws_subnet


################# step 0: get parameters #################
echo "step 0: get parameters"
DOCKER_MACHINE_NAME=$1
DOCKER_BUILD_TAG=$2
DOCKER_BUILD_PATH=$3

AWS_ACCESS_KEY_ID=$4
AWS_SECRET_ACCESS_KEY=$5
AWS_VPC_ID=$6
AWS_REGION=$7
AWS_SUBNET_ID=$8

echo DOCKER_MACHINE_NAME: ${DOCKER_MACHINE_NAME}
echo DOCKER_BUILD_TAG: ${DOCKER_BUILD_TAG}
echo DOCKER_BUILD_PATH: ${DOCKER_BUILD_PATH}

echo AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
#echo AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
echo AWS_VPC_ID: ${AWS_VPC_ID}
echo AWS_REGION: ${AWS_REGION}
echo AWS_SUBNET_ID: ${AWS_SUBNET_ID}


docker_swarm_master=docker-ghd-swarm-master-${DOCKER_MACHINE_NAME}
docker_swarm_agent_00=docker-ghd-swarm-agent-00-${DOCKER_MACHINE_NAME}
docker_swarm_agent_01=docker-ghd-swarm-agent-01-${DOCKER_MACHINE_NAME}

docker_swarm_agents="${docker_swarm_agent_00} ${docker_swarm_agent_01}"


################# step 1: create or start docker machine ##########
echo "step 1: create or start docker machine"

echo "docker machine status"
docker-machine status ${docker_swarm_master}

if [[ $? != 0 ]]; then
    # if not exists, then create new machine
    echo "Create new machine"

    token=`sudo docker run --rm swarm create`

    # swarm master
    echo "Create new master:" ${docker_swarm_master}
    docker-machine create \
        --driver amazonec2 \
        --amazonec2-access-key $AWS_ACCESS_KEY_ID \
        --amazonec2-secret-key $AWS_SECRET_ACCESS_KEY \
        --amazonec2-region $AWS_REGION \
        --amazonec2-vpc-id $AWS_VPC_ID \
        --amazonec2-zone b \
        --amazonec2-subnet-id $AWS_SUBNET_ID \
        --swarm \
        --swarm-master \
        --swarm-discovery token://${token} \
        ${docker_swarm_master}

    # swarm agent
    for docker_swarm_agent in ${docker_swarm_agents}; do
        echo "Create new agent:" ${docker_swarm_agent}
        docker-machine create \
            --driver amazonec2 \
            --amazonec2-access-key $AWS_ACCESS_KEY_ID \
            --amazonec2-secret-key $AWS_SECRET_ACCESS_KEY \
            --amazonec2-region $AWS_REGION \
            --amazonec2-vpc-id $AWS_VPC_ID \
            --amazonec2-zone b \
            --amazonec2-subnet-id $AWS_SUBNET_ID \
            --swarm \
            --swarm-discovery token://${token} \
            ${docker_swarm_agent}
    done
else
    # if exists, then start machine
    echo "Start machine"
    echo "Start master:" ${docker_swarm_master}
    docker-machine start ${docker_swarm_master}

    for docker_swarm_agent in ${docker_swarm_agents}; do
        echo "Start agent:" ${docker_swarm_agent}
        docker-machine start ${docker_swarm_agent}
    done
fi


################# step 2: get docker-machine environment ##########
echo "step 2: get docker-machine environment"
#eval $(docker-machine env ${DOCKER_MACHINE_NAME})
eval $(docker-machine env --swarm ${docker_swarm_master})

################# step 3: build docker image ##########
echo "step 3: build docker image"
docker build --tag=${DOCKER_BUILD_TAG} ${DOCKER_BUILD_PATH}


################# step 4: docker compose up ##########
echo "step 4: docker compose up"

cd ${DOCKER_BUILD_PATH}
#docker-compose build
docker-compose stop
docker-compose rm -f
docker-compose up -d
docker-compose ps

echo "done!"
