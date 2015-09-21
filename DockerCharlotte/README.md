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

## Usage
```
$ go run docker-reg.go help

NAME:
   docker-reg - CLI to list/remove repositories and repository tags from a private Docker registry

USAGE:
   docker-reg [global options] command [command options] [arguments...]

VERSION:
   0.0.1

COMMANDS:
   lsr		  List repositories
   rmr		  Remove repository
   lst		  List tags for repository
   help, h	Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --domain, -d 	Hostname for private registry, example: registry.mydomain.com.
   --port, -p "443"	Port for private registry, default: 443
   --scheme, -s "https"	Scheme for private registry, default: https
   --user, -u 		Username for private registry
   --pass, -x 		Password for private registry [$DOCKER_REGISTRY_PASSWORD]
   --help, -h		show help
   --version, -v	print the version

```

Listing repositories:

```
$ go run docker-reg.go lsr -d myregistry.domain.com -u username

Calling API: GET https://myregistry.domain.com:443/v2/_catalog
{"repositories":["repo1","repo2","repo3"]}
```

Listing tags for a repository:

```
$ go run docker-reg.go lst -d myregistry.domain.com -u username repo1

Calling API: GET https://myregistry.domain.com:443/v2/repo1/tags/list
{"name":"repo1","tags":["latest","1.0.0","1.1.0"]}
```

Removing a repository (right now it just removees blobs and the given tag manifest):

```
$ go run docker-reg.go rmr -d myregistry.domain.com -u username repo1 latest

Calling API: GET https://myregistry.domain.com:443/v2/repo1/manifests/latest
Calling API: DELETE https://myregistry.domain.com:443/v2/repo1/blobs/sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4
Deleted blob: sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4
Calling API: DELETE https://myregistry.domain.com:443/v2/repo1/blobs/sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4
Deleted blob: sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4
...
Calling API: DELETE https://myregistry.domain.com:443/v2/repo1/manifests/sha256:6c5565766982a1dfbe833a9f180424565141e20051ace266fa7a4c7161e16682
Deleted manifest: sha256:6c5565766982a1dfbe833a9f180424565141e20051ace266fa7a4c7161e16682
```

## Todo
- [ ] Add docker-compose.yml configuration for running registry and auth proxy locally
- [ ] Fix usage/error handling for missing arguments and flags
- [ ] Figure out how to completely remove an image and tags after removing blobs and manifests
- [ ] Pretty up the output
- [ ] Figure out how to use auth details from ~/.docker/config.json for simplification
- [ ] Refactor JSON parsing so it isn't so ugly
