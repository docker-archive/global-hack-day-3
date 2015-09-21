#!/bin/bash

set -e

: ${SOCKET:=/var/run/docker.sock}
: ${PORT:=2375}

main() {
  # if the container started with a proper --volume option
  if [ -e $SOCKET ]; then
    # starts a socat proxy from a unix socket to the port
    socat -d -d TCP-L:${PORT},fork UNIX:${SOCKET}
  else
    # otherwise prints the correct command to stdout
    cat << EOF
    docker run -d \
      -p $PORT:$PORT
      --volume=$SOCKET:$SOCKET \
      --name=docker-http \
      sequenceiq/socat
EOF
  fi
}

main "$@"
