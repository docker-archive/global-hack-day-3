Installation on Ubuntu 14.04
# Backend
To use our SaaS, you will need to install these tools:
* docker
* docker-machine
* docker-compose

## a. Docker
```sh
$curl -sSL https://get.docker.com/ | sh
$sudo usermod -aG docker ubuntu
```
After installation finished, you can verify your work by runing docker without sudo
```sh
$ docker run hello-world
```
## b. Docker Machine
After install Docker on you machine, you need to install Docker Machine. Download the Machine binary to somewhere in your $PATH (in my machine, i choose /usr/local/bin)
```sh
$ sudo curl -L https://github.com/docker/machine/releases/download/v0.4.0/docker-machine_linux-amd64 > /usr/local/bin/docker-machine
$ chmod a+x /usr/local/bin/docker-machine
$ docker-machine -v
```
## c. Docker-compose
We need to install docker-compose
```sh
$sudo curl -L https://github.com/docker/compose/releases/download/VERSION_NUM/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
```
If previous command failed, you can try to use pip instead:
```sh
$sudo pip install -U docker-compose
$sudo chmod a+x /usr/local/bin/docker-compose (Optional, if you use pip method don't need to do this)
```
# FrontEnd
## Installation
To use our frontend, you need to install these packages:
* NODEJS (recommended node 0.10.37) 
* NPM
* REDIS
* SQLITE3
* GIT
* GRUNT
* BOWER

After install all these, you need to run:
```sh
$ bower install
$ npm install
```
## Configuration
Before running the application, you have to create config file to match with your enviroment. I create two sample config files. One for client, the other one for server.
```sh
cp config/client-default.js config/client-dev.js
cp config/default.js config/dev.js
```
## Run
```sh
NODE_ENV=dev npm start
grunt test
```
