#!/bin/bash

curl -H "Content-type: application/json" -X POST http://$1/connect/1/$1
