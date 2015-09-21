#!/bin/bash

node --harmony ./node_modules/jasmine/bin/jasmine.js JASMINE_CONFIG_PATH=test/support/jasmine.json $@;
