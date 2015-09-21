# docker-registry-cli
A command line interface for private Docker registries written in Go

## About
This project was started as part of the Docker Global Hack Day 2015.
We run a private Docker registry for some of our images and we want an
easy way to view the repositories in it as well as their tags and delete
the ones no longer needed.

This is my first project in Go so please excuse the jankiness.

## What currently works
- Listing repositories/images
- Listing tags for a given repository
- Deleting blobs and manifests for a repository

## Todo
- [ ] Fix usage/error handling for missing arguments and flags
- [ ] Figure out how to completely remove an image and tags after removing blobs and manifests
- [ ] Pretty up the output
- [ ] Figure out how to use auth details from ~/.docker/config.json for simplification
- [ ] Refactor JSON parsing so it isn't so ugly
