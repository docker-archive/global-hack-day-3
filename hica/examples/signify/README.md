signify docker-hica example
---------------------------

An example Dockerfile that utilizes the `io.hica.bind_pwd` and `io.hica.bind_home` labels to bind current working 
directory and home directory, respectively, into the container. Our image contains Linux port of the BSD signify
tool for cozy signing using ECC cryptography.

```bash
$ cd examples/signify
$ docker build -t signify:1.0 .
$ mkdir -p ~/.signify_keyes/
$ cd ../..
# generate keys in home directory
$ ./docker-hica signify:1.0 -- -G -p ~/.signify_keys/hica_test.pub -s ~/.signify_keys/hica_test.sec
# sign 'docker-hica' executable
$ ./docker-hica signify:1.0 -- -S -x docker-hica.sig -s ~/.signify_keys/hica_test.sec -m docker-hica
# verify signatures
$ ./docker-hica signify:1.0 -- -V -x docker-hica.sig -p ~/.signify_keys/hica_test.pub -m docker-hica
Signature Verified
```
