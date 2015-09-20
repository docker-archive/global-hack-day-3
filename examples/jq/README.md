jq docker-hica example
----------------------

This image contains latest build from `HEAD` of the `jq` tool for processing
JSON documents. It accepts files from the current working directory thanks to 
the `io.hica.bind_pwd` capability, but can also be used with pipes:

```bash
$ cd examples/jq
$ docker build -t jq:1.0 .
$ cd ../..
$ echo '{"test": [1, 2, 3]}' | ./docker-hica --yes jq:1.0 -- '.'
{
  "test": [
    1,
    2,
    3
  ]
}
```
