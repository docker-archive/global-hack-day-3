#!/bin/sh
docker run -ti --rm -v $(pwd):/docs:rw -w /docs apiaryio/base-apib-dev aglio $@
