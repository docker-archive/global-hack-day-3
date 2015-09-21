#!/bin/bash

curl -H "Content-type: application/json" -X POST http://$DC_HOST:$DC_PORT/test/server/ -d '{"THIS IS CLIENT":"OK"}'
echo
