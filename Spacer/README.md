# Spacer

Spacer helps you manage your microservice dependencies.

## Synopsis

First, create a file called `Spacerfile` with the following content:
```
poga/spacer/examples/counter
poga/spacer/examples/hello
```

Now we can boot them up and setup a easy-to-use proxy with one command:
```
$ spacer
Cloning git@github.com:poga/spacer.git into services/poga/spacer ...
Building services/poga/spacer/examples/counter/docker-compose.yml ...
...
...
Successfully built c90b052fff60

Starting services/poga/spacer/examples/counter/docker-compose.yml ...
Cloning git@github.com:poga/spacer.git into services/poga/spacer ...
Building services/poga/spacer/examples/hello/docker-compose.yml ...
...
...
Successfully built 2f880daf95fc

Starting services/poga/spacer/examples/hello/docker-compose.yml ...
Proxying /counter to http://0.0.0.0:5000
Proxying /hello to http://0.0.0.0:32770

Spacer is ready and rocking at 0.0.0.0:9064

$ curl 0.0.0.0:9064/counter
{
  "result": "41"
}

$ curl 0.0.0.0:9064/hello
Hello World
```

## Development

1. git clone `git clone git@github.com:poga/spacer.git`
2. Setup Spacerfile, each line is a microservice repo on github. we also support sub folder in a repo. For example:
    ```
    poga/spacer/examples/counter
    poga/spacer/examples/hello
    ```
    Checkout https://github.com/poga/spacer/tree/master/examples/counter and https://github.com/poga/spacer/tree/master/examples/hello for example services.

3. `go run *.go`

## Todo

- [x] Download and Boot up
- [ ] Scaling service with docker-compose
- [ ] Monitering service with ?
- [ ] Conquer the world with Docker

## Why

We already have great tools to help us dealing with library dependencies,
such as Bundler, NPM, and Cargo.
However, in the world of microservices, we still have to manage our own microservice infrastructure.
Creating a scalable microservice infrastructure is a hard task and need a lot of experiences.

With Spacer, you simply write down the service you need, the version you want.
Spacer will take care of all the work of building, monitering, and scaling for you.

For example, we need a production-ready open-source spam-filter service. we can write "poga/spam-fighter" in a file named Spacerfile. Spacer will pull the correct service from github and deploy them to development environment or production-ready IaaS.

Now we can scale this spam-filter service together and everyone can benefit from it. Thanks to Docker.

# Note

This project is an entry of Docker Global Hack Day #3
