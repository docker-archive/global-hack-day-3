# docker-global-discovery

## How to build Swarm with the custom discovery

1. Get the [customized swarm repo](https://github.com/christophelec/swarm) with 
  ```
  go get github.com/christophelec/docker/swarm
  ``` 

2. Build with : 
  ``` bash
  $GOBIN/godep go install .
  ```

This will generate the swarm binary in ```$GOBIN/swarm```

## How to create the docker image containing the new swarm discovery

1. Clone this repo
2. Use the Dockerfile to generate the image :
  ```
  docker build -t docker-global-discovery .
  ```
Done ! You can now launch a container using the serf discovery with :
```
docker run -p 2375:2375 -p 7946:7946 -d docker-global-discovery ./swarm join serf://<ip.of.cluster.node>@<ip.advertised.to.other> --advertise 127.0.0.1:2375
```

### Explanation :

We forward ports 2375 (swarm) and 7946 (serf) to make sure we are accessible from outside.

Next, we use ./swarm join to use our custom binary (it's still a bit rough around the edges, this kind of things can be improved)

We ask swarm to join a cluster. You can use your own IP as the IP of the cluster node to create the cluster

The advertise is required by Docker but not used

An example would be :

```
docker run -p 2375:2375 -p 7946:7946 -d docker-global-discovery ./swarm join serf://135.24.45.8@135.24.45.7 --advertise 127.0.0.1:2375
```

Where 135.24.45.8 is the IP of a node we want to connect to, and 135.24.45.7 is the IP of *the host of the container*.

We use the IP of the host of the container to make sure other serf agent will be able to contact us, because the internal Docker IP requires linking to be accessible.
