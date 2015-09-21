# Godoauth - Go Docker Token Auth Config

## Intro

As part of the Docker Global Hack Day #3 in Sydney we developed a [token](https://github.com/docker/distribution/blob/master/docs/spec/auth/token.md) authenticator intoduced in registry v2 using [vault](https://www.vaultproject.io/) as a backend. Vault is a tool for securely accessing secrets.

Benefits of using the new token authentication introduced in registry v2 is a fine-grained access control to your private registry. That's specially important in bigger teams where you share your registry with different projects.


## Setup

Requirements:
 * [vault](https://www.vaultproject.io/) server
 * [private registry](https://github.com/docker/distribution)
 * docker 1.6+


To start the Go DOcker AUTHentication Service

    docker run -d -p 5002:5002 --restart=always --name godoauth \
      -v `pwd`/config:/etc/docker/godoauth golja/godoauth

### List of configuration options

This section lists all the configuration options.


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

#### Version

    version: 0.1

The `version` option is **optional**. It specifies the configuration's version.
It is expected to remain a top-level field, to allow for a consistent version
check before parsing the remainder of the configuration file.

#### log

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

#### storage

The `storage` subsection is **required** and it configure the data backend. Currently only vault is supported, but this may change in the future.

    storage:
      vault:
        proto: http
        host: 127.0.0.1
        port: 8200
        auth_token: dbXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXX

##### vault

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


#### http

The `http` option details the configuration for the HTTP(S) server that
hosts the token authentication.

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
     The address for which the server should accept connections.
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

##### tls

The `tls` struct within `http` is **optional**. Use this to configure TLS
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
       Absolute path to x509 cert file
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

#### token

The `token` subsection is **required** and details the JWT token specific options.

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
       Issuer of the token. This value *must* be the same on the registry. Usually
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
       Time in seconds defining how long the token is valid.
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

If you want to try godoauth you will need the last Docker, vault and a working go environment.

### Create dev SSL certs

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.pem
mkdir certs
cp server.pem server.key certs
```

**NOTE**: If you plan to test godoauth on different host then you will need a properly signed SSL or add the following parametes to the docker daemon ```--insecure-registry private.registry.io:5000```

### Registry v2

On your docker host start Registry v2

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
For development purpose you can run vault locally in the development mode. All data will be stored in memory and there is no need to unseal the server.

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

The path mount point name must match the service name defined in the registry above. The auth service was
designed in that way that it can support token authentication for multiple private registry. The only
thing to do is to add another mount point in vault with corresponding users.

#### Add sample users

```
vault write registry/foo password=bar access="repository:linux/app:*;repository:linux/db:pull"
```

This command will add the user *foo* with password *bar* to the registry service with full access to
linux/app image and pull permission to linux/db image.


### godoath

#### Build and Test

Make sure you have Go installed if not visit [golang](https://golang.org/doc/install) page for more info. To then build the project, execute the following commands:

```bash
export GOPATH=$HOME/gocodez
mkdir -p $GOPATH/src/github.com/n1tr0g
cd $GOPATH/src/github.com/n1tr0g
git clone https://github.com/n1tr0g/godoauth.git
cd godoauth
go get -u -f -t ./...
go build ./...
```

To then install the binaries, run the following command. They can be found in `$GOPATH/bin`.

```bash
go install ./...
```

## License

This project is distributed under [Apache License, Version 2.0](LICENSE).
