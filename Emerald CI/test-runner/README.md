Test Runner
===========

A small test runner which executes a build job according to the Emerald CI
configuration for a project. See
[emerald-ci/environment](https://github.com/emerald-ci/environment) to resemble
the exact build environment used within the Emerald CI platform.

YAML Documentation
------------------

The test-runner runs the job according to the `.emerald.yml` file in the
projects directory. It is _required_ to use the service, otherwise a build is
going to fail. There are currently three settings:

* compose\_file (optional): which file in your project is the compose\_file to
  use (defaults to `docker-compose.yml`)
* service: the service to run your build in
* command: the command to run in the service to execute the build

In general, in development you execute someting like this in your projects
directory (:

	docker-compose run web make

To make the test runner to execute the equivalent the config would look like
this:

```
service: web
command: make
```

> Hint: in this example the default `docker-compose.yml` is used since no other
> file is specified.

Development
-----------

Clone the repo and install Godep then compile with

	make
