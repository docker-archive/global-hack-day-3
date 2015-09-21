# Traductor

A tool for translating docker-compose YAML files into process manager launch files (systemd supported so far).

This helps support running docker containers as services under the OS' process manager (such as systemd).
This can extend into being able to package docker containers as rpms for install.

##Features:
v1
- Responsability of operator to make sure services don't clash
- Input template defined in YAML
- Multiple systemd files generated with one command
- All known systemd DK Keys are supported
- Working systemd Unit File
- Using [Jinja2](http://jinja.pocoo.org/) for process manager template file generation
- Multiple docker-compose YAML files parsed at once

v2
- Inject systemd files into the container
- Templated input
- Support for generating service files for other process managers
- RPM generation

## Requirements
To run the systemd service files you will need to install [systemd-docker](https://github.com/ibuildthecloud/systemd-docker). This is a wrapper around docker which solves the following problem of running docker containers under systemd:
> Systemd does not actually supervise the Docker container but instead the Docker client. This makes systemd incapable of reliably managing Docker containers without hitting a bunch of really odd situations.

## Constraints
- Docker Compose does not support all the same arguments Docker run does

## Usage

### Build and Install

    $ python setup.py sdist
    # pip install dist/*.tar.gz

### Test

    $ python -m unittest discover tests -v

#### Vagrant

You can spin this bad boy up with a helloworld webapp on a CoreOS VM.

    $ traductor -f examples/compose-helloworld.yml -d ./target/
    $ vagrant up


License and Authors
-------------------

- Author: Chris Fordham
- Author: Shaun Smekel
- Author: Toby Harris

```text
Copyright 2015, Shaun Smekel

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
