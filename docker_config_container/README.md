# Docker config container

## Why this project

In the context of big or distributed application, we use configurations manager like Zookeeper to easily deploy our configurations ... Why not do the same for containers? There are many aspects to manage as memory, cpu and others network configurations...

## What is this project

This project is a Proof of Concept (PoC) about execute container configured by centralized configuration service.

I never work with powerful system like Zookeeper. I know I can spend some time to implement it so I use a substitution solution, redis, to realise this PoC in hackday time.

## How to use

This project is base on python script an docker client. To be easier to test I include a container to use it.

The first step is get configuration from centralized service and build docker command to run container.

In first we need a redis instance:
```bash
$ docker run -p 6379:6379 --name redis -d redis
```

```bash
$ docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock <image_name> -h
```

Example
```bash
$ docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock hackday3 --host=192.168.99.100 --port=6379 config -n nginx -e qlf -i nginx:1.9.4 -d true -m 300M -s 300M
$ docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock hackday3 --host=192.168.99.100 --port=6379 run -n nginx -e qlf
```

## What next

* Improve error management
* Improve log
* Refactor code to be able to use different configuration manager service
* Use configuration manager service like Zookeeper
* Add feature to manage configuration and environment
* Work with common docker tools like docker-compose and swarm
