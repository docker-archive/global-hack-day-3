# Runnable Containers

This project helps aims to create runnable containers:

- Single-file download
- Should run on any linux
- No docker daemon is required
- Statically linked Runc is included

Use-cases include:

- Ship a Docker image based demo, which can be run without even installing Docker
- Create test databases which are just a single runnable file (no Docker daemon)
- Really create _any_ Docker image based service as single binary ... without Docker daemon

## Solution

- Create a statically linked runc
- Export a Docker container started from a specific image
- Create a self-extracting binary with runc, rootfs, runtime.json and config.json

## Statically linked Runc

The default [make of Runc](https://github.com/opencontainers/runc/blob/master/Makefile)
creates a dynamically linked binary.

The result can be downloaded: from [github release](https://github.com/sequenceiq/global-hack-day-3/releases/tag/v0.3)

- runc-0.3.tgz (https://github.com/sequenceiq/global-hack-day-3/releases/download/v0.3/runc-0.3.tgz)
- runc (https://github.com/sequenceiq/global-hack-day-3/releases/download/v0.3/runc)

Or if you want to build it yourself, the `runc-binary` subdir contains the Dockerfile, which is used for the release:
```
cd runc-binary
make build
```

