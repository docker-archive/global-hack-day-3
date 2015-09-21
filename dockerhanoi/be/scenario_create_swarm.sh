#!/bin/bash
exit 0


docker-machine create -d virtualbox --virtualbox-boot2docker-url=http://sirile.github.io/files/boot2docker-1.8.iso --engine-opt="default-network=overlay:multihost" --engine-opt="kv-store=consul:$(docker-machine ip consul):8500" --engine-label="com.docker.network.driver.overlay.bind_interface=eth1" swarm-0


docker run swarm create

ccb85694224b2abb2549b90aa0078db7


docker-machine create \
        -d virtualbox \
        --swarm \
        --swarm-master \
        --swarm-discovery token://<TOKEN-FROM-ABOVE> \
        swarm-master


docker-machine create \
    -d virtualbox \
    --swarm \
    --swarm-discovery token://<TOKEN-FROM-ABOVE> \
    swarm-agent-00



docker-machine create \
        -d virtualbox \
        --swarm \
        --swarm-master \
        --swarm-discovery token://ccb85694224b2abb2549b90aa0078db7 \
        swarm-master

docker-machine create \
    -d virtualbox \
    --swarm \
    --swarm-discovery token://ccb85694224b2abb2549b90aa0078db7 \
    swarm-agent-00


docker-machine create \
    -d virtualbox \
    --swarm \
    --swarm-discovery token://ccb85694224b2abb2549b90aa0078db7 \
    swarm-agent-01



eval $(docker-machine env --swarm swarm-master)



# start docker swarm
function start_swarm_cluster() {
    docker-machine start swarm-master
    docker-machine start swarm-agent-00
    docker-machine start swarm-agent-01
}


docker-machine start local
docker-machine start swarm-master
docker-machine start swarm-agent-00
docker-machine start swarm-agent-01



docker-machine stop swarm-agent-00
docker-machine stop swarm-agent-01
docker-machine stop swarm-master




docker-machine start local swarm-master swarm-agent-00 swarm-agent-01


docker-machine start $(docker-machine ls -q --filter swarm=swarm-master)






ccb85694224b2abb2549b90aa0078db7


swarm join --advertise=<node_ip:2375> token://<cluster_id>


swarm join --advertise=<node_ip:2375> token://ccb85694224b2abb2549b90aa0078db7




docker run -d swarm join --advertise=192.168.99.100:2375 token://ccb85694224b2abb2549b90aa0078db7



docker run -d -p 192.168.99.102:2375 swarm manage token://ccb85694224b2abb2549b90aa0078db7



docker run -d swarm join --addr=192.168.99.100:2375 token://6856663cdefdec325839a4b7e1de38e8

docker run -d swarm join --addr=192.168.99.101:2375 token://6856663cdefdec325839a4b7e1de38e8


docker run -d -p 2375:2375 swarm manage token://6856663cdefdec325839a4b7e1de38e8


docker -H tcp://192.168.99.102:2375 info

docker -H tcp://0.0.0.0:2357 info




docker run -d swarm join --addr=172.31.40.100:2375 token://6856663cdefdec325839a4b7e1de38e8

docker run -d swarm join --addr=172.31.40.100:2375 token://6856663cdefdec325839a4b7e1de38e8



docker run --rm swarm list token://ccb85694224b2abb2549b90aa0078db7





docker-machine start $(docker-machine ls -q --filter swarm=swarm-master)



# single host
docker-machine create \
    -d virtualbox \
    dm-single-host

eval $(docker-machine env dm-single-host)


cd /home/coc/Desktop/ghd3_backend/app_demo/dockerfile


docker build --tag=ghd3/counter:0.1 .






