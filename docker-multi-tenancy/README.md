# docker-multi-tenancy
Docker Multi Tenancy Proxy

![Example](https://raw.githubusercontent.com/harbur/global-hack-day-3/master/docker-multi-tenancy/images/docker-tenant.png)

## Compilation

With [Captain](github.com/harbur/captain)

```
captain build
```

Or directly with Docker

```
docker build -t harbur/docker-multi-tenancy .
```

Or with Docker Compose

```
docker-compose build
```

## Getting Started

Run the Proxy using Docker:

```
docker run -P 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock harbur/docker-multi-tenancy
```

Or with Docker Compose

```
docker-compose up
```

## Using The Proxy

Test it with curl:

```
DOCKER_HOST=x.x.x.x
curl DOCKER_HOST:9000/images/json
```

or with Docker client:

```
DOCKER_HOST=$(docker-ip):9000
unset DOCKER_TLS_VERIFY
docker images
```

Now docker uses the proxy to redirect requests.

For Mac users: To get the docker IP, you can use the following in your shell (.bashrc)

```
docker-ip() {
  docker-machine ip default 2> /dev/null
}
```

## Transformations:


### docker images

When docker images is performed the following is added by the proxy:

```shell
docker images
```

is converted to:

```shell
docker images -f label=io.harbur.dmt.owner=USERNAME
```

Which in REST API is:

```
GET /images/json
GET /images/json?filters=%7B%22label%22%3A%5B%io.harbur.dmt.owner%3DUSERNAME%22%5D%7D
```

Decoded:

```
GET /images/json?filters={"label":["io.harbur.dmt.owner=USERNAME"]}
```

