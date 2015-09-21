#!/usr/bin/env bash

set -e

source env.sh
pushd src/slim
gox -osarch="linux/amd64" -output="../../bin/linux/dockerslim"
gox -osarch="darwin/amd64" -output="../../bin/mac/dockerslim"
popd
pushd src/launcher
gox -osarch="linux/amd64" -output="../../bin/linux/alauncher"
popd





