# elope

`elope` brings new possibilities to Docker for the deployment of containers.
* Faster deployments of packages through incremental releases.
* Patching of live containers without losing Dockerfile reproducibility and consistency
* Get a more useful diff because it only shows the functional changes to the container (not logs etc.)

This is a submission for the 3rd edition of the Docker Global Hack Day

## Usage
### Pack command 
`elope pack <file> <destination folder>`
* This will snapshot a deployable file (such as a Java web application) for later deployment to a container 
* This will output an ID for the package which can be used later with `elope run`

#### Pack example
`elope pack sample.war /usr/local/tomcat/webapps`

### Run command
` elope run <id> <container>`
* This will run an incremental deployment against a container with no restart necessary (via `docker cp`)
* This will only work for technologies which support rediscovery without container reboot (e.g. Tomcat container)
* This will also generate a new image (from a dynamically generated dockerfile) for full deployment in future 
* A shorter version of the ID can be used similar to how container IDs can be referenced in Docker

#### Run example
`elope run b5b drunk_feynman`

### Diff command
`elope diff <container>`
* This will show all the files that have been deployed to the container with `elope`
* In some use cases, this is more useful than `docker diff` as it shows only the files which affect functionatily

#### Diff example
`elope diff drunkfeynman`

## How to build and run
* Setup `$GOPATH` to point to a location like `~gopath`
* Setup a local path such as `~gocode/src/github.com/craigbarrau/global-hack-day-3/nohoman`
* `cd` to `nohoman\elope`
* Run `go install`
* Now `elope` is installed under `~gocode/bin`
* Run `elope` to see the usage menu

