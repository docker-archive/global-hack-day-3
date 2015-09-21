#!/bin/bash

DIR="$(git rev-parse --show-toplevel)"
bash $DIR/stop.sh
bash $DIR/run.sh
