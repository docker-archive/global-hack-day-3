Emerald CI API
==============

This is the API that connects everything to make the Emerald CI Platform work.

It receives (GitHub) webhooks and triggers a build/job which is then executed
in a docker container using the
[emerald-ci/environment](https://github.com/emerald-ci/environment) image. The
logs produced by the build are sent to a
[fluentd](https://github.com/emerald-ci/fluentd) instance which in turn
redirects the logs into a rabbitmq which is exposed by the API through the logs
endpoint and can be streamed using Websockets.
