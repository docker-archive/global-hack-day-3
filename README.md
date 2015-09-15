# container-swiss-knife

A tool for making containers easy to debug/hack.

## Motivation
Sometimes you just need to look in a docker container more closely like:

* is DNS working correctly
* can app connect to this port
* what ports is my process listening
* make a quick gdb session

And you find that the tool is not inside - so you need to install tools/setup them opr even recreate container. Now you dont - you just use this tool and it will setup stuff for you almost instantly.

## Features:

* Injecting tools into running container (and removing them after)
* Network transparent
* Browsing container FS
* Scriptable - easy to use in bash scripts
