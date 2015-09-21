#!/bin/bash

DIR=$(git rev-parse --show-toplevel)
appdef=$DIR/appdef.json
ORCHESTRA_VERSION="$(jshon -e orchestra -e version -u < $appdef)"
project="$(jshon -e project -e name -u < $appdef)"
appname=$(jshon -e name -u < $appdef)
appslug=$(jshon -e slug -u < $appdef)
branch="$(git rev-parse --abbrev-ref @)"
services="$(jshon -e services -k < $appdef)"
imagebase=sean9999/$project-$appslug
