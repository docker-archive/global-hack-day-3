#!/bin/bash
set -e

git clone $1 /project
git checkout $2
test-runner

