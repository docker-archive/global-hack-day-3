#!/usr/bin/env bash

while true
do 
  clear
  sleep 30
  echo Professor Owl running the hello world docker image
  sleep 15
  docker images
  sleep 15
  docker run -it --rm hello-world
  sleep 60
done
