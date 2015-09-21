Emerald CI
==========

[DEMO VIDEO](https://vimeo.com/139941714)

Emerald CI want to pursue a Docker Compose driven development. You test your
software on the CI server just like you test locally, it drastically reduces
the risk of breaking the build due to differences of the environments. It uses
the same `docker-compose.yml` specification as Docker Compose, therefore all
you need is a `docker-compose.yml` and a minimal config in your repo.

How it works
------------

![How It Works](/how_it_works.png?raw=true "Emerald CI - How It Works")

Emerald CI is composed of multiple microservices:

* An [HAProxy](https://github.com/emerald-ci/haproxy) is required to combine
  the API and Webapp to allow resource and session sharing.
* The [Webapp](https://github.com/emerald-ci/webapp) is an
  [AngularJS](https://angularjs.org/) app that listens to events sent via
WebSocket and displays those. It's initial data is requested through the API.
* The [API](https://github.com/emerald-ci/api) is the heart of the System it
  enqueues workers to run build jobs and streams the logs of a job to the
Webapp.
* A worker (built using [Sidekiq](http://sidekiq.org/)) starts the job, records
  the log and updates the status of a job throughout the build cycle.
* The Docker host is used to run a job on using the
  [emerald-ci/environment](https://github.com/emerald-ci/environment) Docker
image. It configures the job container to send its logs to a fluentd server.
* Within a container the job is executed using Emerald CI's
  [test-runner](https://github.com/emerald-ci/test-runner), which has been
developed using the [libcompose](https://github.com/docker/libcompose) library.
See [here](https://github.com/emerald-ci/test-runner#yaml-documentation) to
find out how to configure your project to use Emerald CI.
* [Fluentd](http://www.fluentd.org/) collects the logs produced by a job and
  forwards it to a RabbitMQ server.
* [RabbitMQ](https://www.rabbitmq.com/) then sends the logs to each subscriber,
  which can either be the API which forwards the stream to a WebSocket or the
Worker which persists the log for later access.

These are the high level steps a job goes through in the Emerald CI system.

Setup your own
--------------

Since Emerald CI wants to pursue a Docker Compose driven development, deploying
it is a matter of a `docker-compose.yml`. You can use your favorite
orchestration tools which support the compose specification.

> We like to use [Rancher](http://rancher.com/) and
> [rancher-compose](https://github.com/rancher/rancher-compose). Using
> rancher-compose it is just a matter of `rancher-compose up` to setup the
> whole system, but for single server setups the normal [Docker
> Compose](https://github.com/docker/compose) totally suffices.

An example
[`docker-compose.yml`](https://github.com/emerald-ci/Emerald-CI/blob/master/docker-compose.yml)
has been placed in this repo to deploy the system. Take it, deploy, test and
have fun! :smile:

> Please make sure to change environment variables to match your setup and
> change secrets!

Use Emerald CI in your own project
----------------------------------

All you need to use Emerald CI is a `.emerald.yml` file in your repos root
directory (see [documentation on the `.emerald.yml`
file](https://github.com/emerald-ci/test-runner#yaml-documentation)) and
`docker-compose.yml`.

What's to come
--------------

Right now Emerald CI only tests your software. To complete the Continuous
Development cycle, deployment has to be added. The plan is to allow writing
plugins as docker images which get the build context passed.

Issues
------

This is a meta repo. Report all issues for
[here](https://github.com/emerald-ci/Emerald-CI/issues).
