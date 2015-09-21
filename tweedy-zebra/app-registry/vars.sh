#!/bin/bash

DIR="$(git rev-parse --show-toplevel)"
project="orchestra"
appname="appregistry"
branch="$(git rev-parse --abbrev-ref @)"
rev="$(git rev-parse @)"
services="$(ls $DIR/services)"
