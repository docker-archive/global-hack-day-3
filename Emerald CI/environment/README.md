Emerald CI Environment
======================

Docker image containing the environment used to run a build job within Emerald
CI.

It can be used to reconstruct the build environment locally.

For example, take the ruby example: https://github.com/emerald-ci/ruby-example

To run the job exactly as it is done on the Emerald CI environment simply run:

	docker run docker run --rm --privileged -v /var/run/docker.sock:/var/run/docker.sock -it emeraldci/environment https://github.com/emerald-ci/ruby-example c05c3b3ef562887153bcaa5aa93ff74f1c9f44e4

> Hint: This is almost exactly how Emerald CI starts a job, except, that log
> collection is added using docker's fluentd logging driver

Development
-----------

To build this image with the latest released version of the Emerald Test Runner
run

	make

To build the image with a local build of the test-runner use

	make dev
