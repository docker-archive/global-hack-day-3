# godoauth - Go Docker Token Auth Config

Godoauth is a [token authenticator](https://github.com/docker/distribution/blob/master/docs/spec/auth/token.md) (introduced in Docker Registry v2) which uses [Vault](https://www.vaultproject.io/) as a backend, developed as part of the Docker Global Hack Day #3 in Sydney.

The new [token auth](https://github.com/docker/distribution/blob/master/docs/spec/auth/token.md) allows for fine-grained access control for private registries, especially important in large teams when many different projects share a registry.


## Setup

Requirements:
 * [Vault](https://www.vaultproject.io/) server
 * [Docker Private Registry](https://github.com/docker/distribution)
 * [Docker 1.6+](https://www.docker.com)
 * [Go 1.4+](https://www.golang.org) (only tested on 1.5.1)

If you haven't setup Go before, you need to first [install Go](https://golang.org/doc/install) and set a `GOPATH` (see [https://golang.org/doc/code.html#GOPATH](https://golang.org/doc/code.html#GOPATH)).

```bash
go get -u -f -t github.com/n1tr0g/...
```

This will fetch the code and build the command line tools into `$GOPATH/bin` (assumed to be in your `PATH` already). To start the Go Docker Authentication Service:

    docker run -d -p 5002:5002 --restart=always --name godoauth \
      -v `pwd`/config:/etc/docker/godoauth \
      -v `pwd`/certs/:/certs \
      golja/godoauth

## Configuration

Configuration is specified in a [YAML file](https://en.wikipedia.org/wiki/YAML) which can be set using the (`-config` option).

    ---
    version: 0.1
    log:
      level: info
      file: /tmp/godoauth.log
    storage:
      vault:
        proto: http
        host: 127.0.0.1
        port: 8200
        auth_token: dbXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXX
    http:
      timeout: 5s
      addr: :5002
      tls:
        certificate: certs/server.pem
        key: certs/server.key
    token:
       issuer: Token
       expiration: 800
       certificate: certs/server.pem
       key: certs/server.key

In some instances a configuration option is **optional**

### Version

    version: 0.1

The `version` option is **optional**. It specifies the configuration's version.
It is expected to remain a top-level field, to allow for a consistent version
check before parsing the remainder of the configuration file.

### log

The `log` subsection is **optional** and configures the behavior of the logging system. 
The logging system outputs everything to stdout. You can adjust the granularity and format
with this configuration section.

    log:
      level: info
      file: /tmp/godoauth.log

<table>
  <tr>
    <th>Parameter</th>
    <th>Required</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <code>level</code>
    </td>
    <td>
      no
    </td>
    <td>
      Sets the sensitivity of logging output. Permitted values are
      <code>error</code>, <code>warn</code>, <code>info</code> and
      <code>debug</code>. The default is <code>info</code>. TODO
    </td>
  </tr>
  <tr>
    <td>
      <code>file</code>
    </td>
    <td>
      no
    </td>
    <td>
      Sets logging file. TODO
    </td>
  </tr>
</table>

### storage

The `storage` subsection is **required** and it configures the data backend. Currently only `vault` is supported, but this may change in the future.

    storage:
      vault:
        proto: http
        host: 127.0.0.1
        port: 8200
        auth_token: dbXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXX

#### vault

<table>
  <tr>
    <th>Parameter</th>
    <th>Required</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <code>proto</code>
    </td>
    <td>
      yes
    </td>
    <td>
      Define vault proto backend. Permitted values are <code>http</code>
      and <code>https</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>host</code>
    </td>
    <td>
      yes
    </td>
    <td>
      Vault server address
    </td>
  </tr>
  <tr>
    <td>
      <code>port</code>
    </td>
    <td>
      yes
    </td>
    <td>
      Vault server port
    </td>
  </tr>
  <tr>
    <td>
      <code>auth_token</code>
    </td>
    <td>
      yes
    </td>
    <td>
      Vault authentication token used to connect to vault server. Usually generated
      via vault token-create
    </td>
  </tr>
</table>


### http

The `http` option contains the config for the HTTP(S) server that
hosts token authentication.

    http:
      addr: :5002
      timeout: 5s
      tls:
        certificate: certs/server.pem
        key: certs/server.key

<table>
  <tr>
    <th>Parameter</th>
    <th>Required</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <code>addr</code>
    </td>
    <td>
      yes
    </td>
    <td>
     The bind address for the server.
    </td>
  </tr>
  <tr>
    <td>
      <code>timeout</code>
    </td>
    <td>
      yes
    </td>
    <td>
     After how many seconds the connection will be closed.
    </td>
  </tr>
</table>

#### tls

The `tls` struct within `http` is **optional** and is used setup TLS
for the server.

<table>
  <tr>
    <th>Parameter</th>
    <th>Required</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <code>certificate</code>
    </td>
    <td>
      yes
    </td>
    <td>
       Absolute path to x509 cert file.
    </td>
  </tr>
    <tr>
    <td>
      <code>key</code>
    </td>
    <td>
      yes
    </td>
    <td>
      Absolute path to x509 private key file.
    </td>
  </tr>
</table>

### token

The `token` subsection is **required** and contains the JWT token specific options.

    token:
       issuer: Token
       expiration: 800
       certificate: certs/server.pem
       key: certs/server.key

<table>
  <tr>
    <th>Parameter</th>
    <th>Required</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <code>issuer</code>
    </td>
    <td>
      yes
    </td>
    <td>
       Issuer of the token. This value <b>must</b> be the same on the registry. Usually
       you pass it as REGISTRY_AUTH_TOKEN_ISSUER=Issuer
    </td>
  </tr>
  <tr>
    <td>
      <code>expiration</code>
    </td>
    <td>
      yes
    </td>
    <td>
       Token lifetime in in seconds.
    </td>
  </tr>
  <tr>
    <td>
      <code>certificate</code>
    </td>
    <td>
      yes
    </td>
    <td>
      Path to x509 public cert file used for JWT signing.
    </td>
  </tr>
  </tr>
    <tr>
    <td>
      <code>key</code>
    </td>
    <td>
      yes
    </td>
    <td>
      Path to x509 private key file used for JWT signing.
    </td>
  </tr>
</table>

## Development

If you want to contribute to `godoauth` you will need the latest Docker, Vault and a working Go environment.

### Create Development SSL Certificates

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.pem
mkdir certs
cp server.pem server.key certs
```

**NOTE**: If you plan to test godoauth on a different host you will need a properly signed SSL or you must add ```--insecure-registry private.registry.io:5000``` to the docker daemon parameters.

## Docker Registry v2

On your Docker host start Registry v2

```
docker run -d -p 5000:5000 --restart=always --name registry \
  -v /root/data:/var/lib/registry \
  -v /root/certs:/certs \
  -e REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY=/var/lib/registry \
  -e "REGISTRY_AUTH=token" \
  -e REGISTRY_AUTH_TOKEN_REALM=http://localhost:5002/auth \
  -e REGISTRY_AUTH_TOKEN_ISSUER=Token \
  -e "REGISTRY_AUTH_TOKEN_SERVICE=registry" \
  -e REGISTRY_AUTH_TOKEN_ROOTCERTBUNDLE=/certs/server.pem \
  --restart=always \
  registry:2.1.1
```

### Vault

For development purposes you can run Vault locally in development mode. All data will be stored in memory and there is no need to unseal the server.

#### Install

```
wget https://dl.bintray.com/mitchellh/vault/vault_VERSION_DISTRO.zip
unzip vault_VERSION_DISTRO.zip
cp vault /usr/local/bin
vault server -devel
```

#### Create service mount point

```
./vault mount -path registry generic
```

The path mount point must match the service name defined in the registry above. The auth service has been designed to support multiple private registries, simply add another mount point in vault with corresponding users.

#### Add sample users

```
vault write registry/foo password=bar access="repository:linux/app:*;repository:linux/db:pull"
```

This will add the user *foo* with password *bar* to the registry service with full access to
`linux/app` image and pull permission to `linux/db` image.


## License

This project is distributed under [Apache License, Version 2.0](LICENSE).
