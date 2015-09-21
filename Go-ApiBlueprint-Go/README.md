# Project: Docker Remote API in machine-readable format

## Goal

The current version of Docker Remote API documentation is built on Markdown and maintained manually. In this project, 
we'd like to demonstrate that switching to (Markdown-based) API Blueprint can bring a lot of benefits to both the 
documentation maintainers and the tool developers.

To the maintainers, the data structures and action descriptions can be DRYed, making the documentation much easier to 
maintain.

With this machine-readable version, API consuming gets easier and testing simpler. Since the format is both human and 
machine-readable, it is ensured that the documentation structure is consistent and comprehensible, containing all 
details needed to use the API correctly.

Slightly modifying Docker API documentation to be machine-readable:
- makes the documentation more consistent and comprehensive to the human reader (e.g. specifying explicitly if a 
  parameter is required or optional or including the expected data type)
- greatly facilitates API consumption
- provides solid support for testing the API-consuming client without using the actual API implementation

### Maintaining Documentation
easier, based on CI integration
DRYed

### Consuming API
easier - interactive tools, code snippets
more consistent docs - shorter learning curve

### Further Steps

This project is a proof-of-concept suggestion to the API documentation maintainers. If this makes sense to you, we will 
be happy to help with the transition, including:

- setting up continuous integration to ensure API implementation is consistent with API documentation
- extending the use of [MSON](https://github.com/apiaryio/mson/blob/master/MSON%20Specification.md) within the 
  documentation to DRY the data structures
- converting the rest of the Docker APIs to API Blueprint

## Contributors

- Ladislav Prskavec (ladislav@prskavec.net)
- Vilibald Wanča (wvi@apiary.io)
- Naďa Jašíková (nada@apiary.io)

## Documentation

API Blueprint is a documentation-oriented web API description language. The API Blueprint is essentially a set of 
semantic assumptions laid on top of the Markdown syntax used to describe a web API.

Using the open-source [Aglio](https://github.com/danielgtaylor/aglio), we generated this [version](http://go-apiblueprint-go.github.io/DockerRemoteAPI/).
 
Alternatively, you can see this [version in Apiary](http://docs.dockerremoteapi.apiary.io/).

## References

- [API Blueprint specification](https://github.com/apiaryio/api-blueprint/blob/master/API%20Blueprint%20Specification.md)
- [Drafter - API Blueprint Parser](https://github.com/apiaryio/drafter)
- [Aglio - An API Blueprint renderer with theme support that outputs static HTML](https://github.com/danielgtaylor/aglio)
- [MSON specification](https://github.com/apiaryio/mson/blob/master/MSON%20Specification.md)

## Running with Docker

### Build image

```
./build.sh
```

or

```
docker build -t apiaryio/base-apib-dev .
```

### Generate documentation

```
./generate_docs.sh -i docker_remote_api_v1.21.apib -o index.html
```

or

```
docker run -ti --rm -v $(pwd):/docs:rw -w /docs apiaryio/base-apib-dev aglio -i docker_remote_api_v1.21.apib -o index.html
```

### Validate API Blueprint

```
./validate.sh -lu docker_remote_api_v1.21.api
```

or

```
docker run -ti --rm -v $(pwd):/docs:rw -w /docs apiaryio/base-apib-dev drafter -lu docker_remote_api_v1.21.api
```
