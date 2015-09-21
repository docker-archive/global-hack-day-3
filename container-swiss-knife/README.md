# container-swiss-knife

A tool for making containers easy to debug/hack. It enables you to *temporaly* inject your desired set of tools into an application container debug/hack it and then remove stuff from a container.

## Quickstart

1) setup a tools container
```
docker build -t csk-tools Dockerfiles/debian-tools
```
2) setup a csk container
```
docker build -t csk .
```

3) enhance desired container with your tool and follow the instruction to use it! 
```
docker run -ti -v /var/run/docker.sock:/var/run/docker.sock csk <container to enhance>
```
4) hack it!

5) remove tools from a container
```
docker run csk --remove <container to enance>
```

## Motivation
Sometimes you just need to look in a docker container more closely like:

* is DNS working correctly
* can app connect to this port
* what ports is my process listening
* make a quick gdb session

And you find that the tool is not inside - so you need to install tools/setup them opr even recreate container. Now you dont - you just use this tool and it will setup stuff for you almost instantly.

## Features:

* Injecting tools into running container (and removing them after)
* Network transparent
* Browsing container FS
* Scriptable - easy to use in bash scripts
