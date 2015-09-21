# Global Discovery Token

This little hack has been realised during the Global Hack Day, by Alain Douangpraseuth and Christophe Lecointe

Our goal was to provide a new discovery backend for Docker Swarm, allowing a node to join a swarm as easily as with tokens, in a very decentralized way (unlike tokens, which depends on DockerHub / Internet connection).

We chose to implement [Serf](https://github.com/hashicorp/serf) as a discovery backend to achieve our goal. Serf is a decentralized solution for service discovery and orchestration.

It is based on the gossip protocol, which is a synchronisation protocol for distributed systems, completely decentralized and _eventually consistent_

## Our solution

At the end of the hackathon, we have implemented the new discovery backend for swarm, that you can check in our [forked swarm repo](https://github.com/christophelec/swarm), mainly in discovery/serf.

We also created a docker image to replace the regular swarm with our own. This swarm image comes bundled with a Serf agent, that is launched and connects to a cluster if needed, and the necessary scripts. You can pull our image from Dockerhub at [adouang/docker-global-discovery](https://hub.docker.com/r/adouang/docker-global-discovery/)

## Getting your hands dirty

### How to build Swarm with the custom discovery

1. Get the [customized swarm repo](https://github.com/christophelec/swarm) with 
  ```
  go get github.com/christophelec/docker/swarm
  ``` 

2. Build with : 
  ``` bash
  $GOBIN/godep go install .
  ```

This will generate the swarm binary in ```$GOBIN/swarm```

### How to create the docker image containing the new swarm discovery

1. Clone this repo
2. Use the Dockerfile to generate the image :
  ```
  docker build -t docker-global-discovery .
  ```
Done ! You can now launch a container using the serf discovery with :
```
docker run -p 2375:2375 -p 7946:7946 -p 7373:7373 -d docker-global-discovery ./swarm join serf://<ip.of.cluster.node>@<ip.advertised.to.other> --advertise 127.0.0.1:2375
```

#### Explanation :

We forward ports 2375 (swarm), 7946 (serf) and 7373(RPC serf) to make sure we are accessible from outside.

Next, we use ./swarm join to use our custom binary (it's still a bit rough around the edges, this kind of things can be improved)

We ask swarm to join a cluster. You can use your own IP as the IP of the cluster node to create the cluster

The advertise is required by Docker but not used

An example would be :

```
docker run -p 2375:2375 -p 7946:7946 -p 7373:7373 -d docker-global-discovery ./swarm join serf://135.24.45.8@135.24.45.7 --advertise 127.0.0.1:2375
```

Where 135.24.45.8 is the IP of a node we want to connect to, and 135.24.45.7 is the IP of *the host of the container*.

We use the IP of the host of the container to make sure other serf agent will be able to contact us, because the internal Docker IP requires linking to be accessible.

## What now ?

There is still a lot of work to do to improve the solution, but all the basis are here : we have a way to connect nodes from a Swarm, from anywhere (well as long as they can communicate), simply by providing the IP of one node (any node really) of the cluster.

Now, possible improvements include :
* Smooth things up for regular use
* Improve security by doing cluster verification 
* Streamline build/deployment
* Merge our swarm improvements with the original repo
* Stop using sh scripts
