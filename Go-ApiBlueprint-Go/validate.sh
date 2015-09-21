#!/bin/sh
if [ $# -eq 0 ]
  then
    docker run -ti --rm -v $(pwd):/docs:rw -w /docs apiaryio/base-apib-dev drafter -h
  else
    docker run -ti --rm -v $(pwd):/docs:rw -w /docs apiaryio/base-apib-dev drafter -lu $@
fi
