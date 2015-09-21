# Project: Docker Remote API machine readable

## Goal

@TODO@

## Contributors

- Ladislav Prskavec (ladislav@prskavec.net)
- Vilibald Vanča (wvi@apiary.io)
- Naďa Jasikova (nada@apiary.io)

## Documentation

API Blueprint is a documentation-oriented web API description language. The API Blueprint is essentially a set of semantic assumptions laid on top of the Markdown syntax used to describe a web API.

- Using [Aglio](https://github.com/danielgtaylor/aglio) we generate this [version](http://go-apiblueprint-go.github.io/DockerRemoteAPI/) or you can see [version in Apiary](http://docs.dockerremote.apiary.io/).

## References

- [API Blueprint specification](https://github.com/apiaryio/api-blueprint/blob/master/API%20Blueprint%20Specification.md)
- [Drafter - API Blueprint Parser](https://github.com/apiaryio/drafter)
- [Aglio - An API Blueprint renderer with theme support that outputs static HTML](https://github.com/danielgtaylor/aglio)

## Using with docker

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
