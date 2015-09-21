#!/bin/bash

sleep 5 # hacky but wait for rabbitmq to startup
/usr/local/bundle/bin/fluentd -c /etc/fluent/fluent.conf

