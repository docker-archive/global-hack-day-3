#!/bin/bash -x
# Author Swapnil Daingade
# Script to configure the master node in the physical cluster
# Creates networking configuration for 3 YARN cluster. 3 is an
# arbitrary limit imposed for demo purposes. User can create
# any number of YARN clusters using the steps below. This script
# is to be executed only on one node in the physical cluster.
# On other nodes in the physical cluster the docker-create-worker.sh
# script should be executed.

# Stop docker daemon. We will restart it with custom parameters 
service docker stop

# TODO Take this as input arg
IP_ADDR=10.10.30.52
SUBNET=15

# We identify YARN cluster with colors for ease
CLUSTERS=("red" "green" "blue")

# This node acts as consul server node
consul agent -server -bootstrap -data-dir /tmp/consul -bind=$IPADDR &
sleep 5
docker -d --kv-store=consul:localhost:8500 --label=com.docker.network.driver.overlay.bind_interface=eth0  --insecure-registry=maprdocker.lab &

for CLUSTER in "${CLUSTERS[@]}"
do
  # First create an overlay network for the YARN cluster
  docker network create -d overlay $CLUSTER

  # Now create a bridge on the host for connecting to the underlay network
  # There is one bridge per YARN cluster on every host
  brctl addbr $CLUSTER 
  SUBNET_IP="$SUBNET.$SUBNET.0.1"
  ip addr add $SUBNET_IP/16 dev $CLUSTER
  ip link set dev $CLUSTER up
  SUBNET=$((SUBNET+1))

  # Setup NAT so container can access underlay network
  iptables -A POSTROUTING -o $CLUSTER -m addrtype --src-type LOCAL -j MASQUERADE
  iptables -t nat -A POSTROUTING -s $SUBNET_IP/16 ! -o $CLUSTER -j MASQUERADE
done

# Configure Mesos Slave so it can launch docker containers
ATTRIBUTES=/etc/mesos-slave/attributes
mkdir -p $ATTRIBUTES
touch $ATTRIBUTES/containerizers
echo "docker,mesos" > $ATTRIBUTES/containerizers
cat $ATTRIBUTES/containerizers
