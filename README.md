docker-record
=============

Installation
------------
It's just a single python file right now, so get it in your path somehow.

Usage
-----

    # <CONTAINER> should be running

    docker-record <CONTAINER>
    # drop into a bash session
    apt-get update
    apt-get install some-package
    vim /etc/some.conf
    exit

    # does my container work now?
    # no...

    docker-record <CONTAINER>
    # try something else
    exit

    # does my container work now?
    # yes!

    # generate a dockerfile for whatever I just did!
    docker-record <CONTAINER> --replay

Future Work
-----------

- Run `docker diff` between every command. This can be done by [sharing a named pipe with the container] [1], writing to that pipe from the instrumentation code, and reading from it in the docker-record process, which would then call diff on every read. The session would have to be converted from a call to exec (see [this approach] [2]), so that the python process could read the pipe and run diff. Furthermore, adding volumes to an already running container is not yet supported, but may be in the [future] [3].

[1]: https://github.com/docker/docker/issues/14221#issuecomment-116618705
[2]: https://github.com/d11wtq/dockerpty/issues/30 "Maybe we could contribute to this other project."
[3]: https://github.com/docker/docker/pull/14242 "Look, a volume api!"
