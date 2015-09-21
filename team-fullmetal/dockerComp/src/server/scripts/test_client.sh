#!/bin/bash

# Usage: ./test_client.sh '172.17.0.8' '[(1,2),(5,2),(3,5)]'

curl -H "Content-type: application/json" -X POST http://$1/tasks/ -d "$2"
echo
