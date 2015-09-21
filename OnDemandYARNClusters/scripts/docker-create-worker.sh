#!/bin/bash -x
# Author Swapnil Daingade
# Script to configure the worker node in the physical cluster
# This script be executed on all nodes except the master node
# in the physical cluster. On the master node the docker-create-master.sh
# script should be executed.

# Stop docker daemon. We will restart it with custom parameters
service docker stop

IP_ADDR=`/sbin/ifconfig eth0 | grep "inet addr" | awk -F: '{print $2}' | awk '{print $1}'`
SUBNET=15
CLUSTERS=("red" "green" "blue")

# This node acts as consul client node
consul agent -data-dir /tmp/consul -bind $IP_ADDR & 
sleep 5
#TODO Take master node as arg
consul join 10.10.30.52
sleep 5
docker -d --kv-store=consul:localhost:8500 --label=com.docker.network.driver.overlay.bind_interface=eth0 --label=com.docker.network.driver.overlay.neighbor_ip=10.10.30.52 &

for CLUSTER in "${CLUSTERS[@]}"
do
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
