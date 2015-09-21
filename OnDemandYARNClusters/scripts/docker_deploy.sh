#!/bin/bash -x
# Author: Swapnil Daingade and Sarjeet Singh
# Script executed by Executor (Mesos) to launch a docker container as Mesos Task
# This docker container will function as a Yarn ResourceManager or NodeManager
# We configure storage and network for the docker container as part of this script.

echo "Starting deploying script"

#ARG1: taskName given by Mesos
taskName=$1
#ARG2: YARN cluster to which this node belongs, E.g. Red cluster, Blue cluster etc
clusterId=$2
#ARG3: Image to be deployed by docker.
image=$3

# TODO Make loop back device to be exposed to container configurable
device="/dev/loop0"
# Create container with storage device attached. Attach container to overlay network corresponding to cluster
#cid=`docker run --cap-add=ALL --device=$device:/dev/sdc -itd --publish-service=$taskName.$clusterId $image`
cid=`docker run --privileged -itd --publish-service=$taskName.$clusterId $image`
echo "Created container is $cid"

# Configuring networking
# Inspired from code here https://docs.docker.com/articles/networking/
# Each container has two network interfaces.
# First, eth0 is connected to the overlay network corresponding
#   to the YARN cluster
# Second, eth1 is connected to a bridge corresponding to the YARN cluster
#   This allows the node to access the underlay network but not a node
#   in another YARN cluster.

pid=`docker inspect -f '{{.State.Pid}}' $cid` #
echo "pid for container is $pid"

mkdir -p /var/run/netns
ln -s /proc/$pid/ns/net /var/run/netns/$pid
ip addr show $clusterId

#shorten length of container id
cid=${cid:4:5}

# Each cluster has its own bridge per host to connect to the underlay network
bridgeIP=`ip addr show $clusterId | grep 'inet .* global' | awk '{print $2}' | sed 's/\/16//'`
RM_IP=`ip addr show $clusterId | grep 'inet .* global' | awk '{print $2}' | sed 's/1\/16/2/'`

# Create a veth pair 
ip link add $clusterId-$cid-0 type veth peer name $clusterId-$cid-1

# Add one end to the bridge
brctl addif $clusterId $clusterId-$cid-0
ip link set $clusterId-$cid-0 up

# Change namespace of the other end of veth pair to that of the container
ip link set $clusterId-$cid-1 netns $pid
# Rename to eth1
ip netns exec $pid ip link set dev $clusterId-$cid-1 name eth1
ip netns exec $pid ip link set eth1 up
ip netns exec $pid ip addr add $RM_IP/16 dev eth1
# Set default route via bridge (eth1). Delete existing (eth0)
ip netns exec $pid ip route delete default
ip netns exec $pid ip route add default via $bridgeIP

#TODO Check if Mesos task exits after this script has finished running.
# If yes do something like this to keep script from terminating
#while sleep 10;
#do
#  date;
#done
