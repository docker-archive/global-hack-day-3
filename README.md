HICA (Host Integrated Container Applications)
---------------------------------------------
[hɑɪkː]

The goal of this project is to define a set of image label metadata 
and launcher tooling that understands said metadata to provide for
smooth experience running containerized applications with tight
integration with the host operating system.

### Docs

Versioned specification of all labels can be found in `docs/label.md`.

Guidelines for Dockerfiles can be found in `docs/dockerfile-guidelines.md`.

### Examples

Examples directory currently contains several Dockerfiles:
 * `jq`
 * `firefox-testing`
 * `signify`

Please refer to `README.md` in each particular subdirectory.

### Advanced usage

Let's overview the basic stuff:

```bash
$ ./docker-hica --help
usage: docker-hica [-h] [--show-args] [--verbose] [--yes] hica_app_name

positional arguments:
  hica_app_name

optional arguments:
  -h, --help     show this help message and exit
  --show-args
  --verbose
  --yes
```

The `--show-args` flag allows for displaying configurable parameters for image injectors, so
to see what parameters can be passed to the `examples/firefox` image, execute:
```bash
$ ./docker-hica --show-args firefox:1.0
usage: docker-hica [-h] [--show-args] [--verbose] [--yes]
                   [--machine-id-path MACHINE_ID_PATH]
                   [--xsocket-path XSOCKET_PATH]
                   [--x-display-num X_DISPLAY_NUM]
                   hica_app_name
```

When `--verbose` is specified, the Docker command is also printed out during execution:
```bash
$ ./docker-hica --verbose firefox:1.0
The container requests the following capabilities: 
 - Bind mounts current working directory (/Repos/docker-hica) into the container
 - Bind mounts machine-id into the container
 - Bind mounts XSocket into the container
Proceed? [y/Y/n]: y
Executing: docker run -i -u 1000:1000 --volume /Repos/docker-hica:/Repos/docker-hica:Z -w /Repos/docker-hica --volume /etc/machine-id:/etc/machine-id:Z --volume /tmp/.X11-unix:/tmp/.X11-unix:Z -e DISPLAY=:0 firefox:1.0
```

And finally the `--yes` flag allows for skipping the initial prompt for confirmation as seen on the example above.
This option is dangerous, future versions will treat 'Y' in the prompt response as 'Yes and remmber', so that
the initial capability request is reviewed at least once.
