Docker Socat
============

Expose docker socket via tcp.

Start with

	docker run -it -v /var/run/docker.sock:/var/run/docker.sock --privileged emeraldci/docker-socat

