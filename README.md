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
