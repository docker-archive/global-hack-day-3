# Setup and installation of Professor Owl

You'll need the following:
- docker-machine
- a digital ocean account

## Provision your docker engine

    export DO_PAT=your_digital_ocean_personal_access_token
    docker-machine create prowl \
            --driver digitalocean \
            --digitalocean-access-token $DO_PAT \
            --digitalocean-region "sfo1" \
            --digitalocean-size "1gb"

This will create a new docker-machine called prowl, which will be an ubuntu 
server with 1GB of RAM in Digital Ocean's San Francisco data centre.

## Setup the shell account for Professor Owl

    docker-machine ssh prowl
    useradd prowl -m -s /bin/bash
    adduser prowl docker
    passwd prowl

This will setup a non-root user with access to docker.

## Install additional software as root

    apt-get update && apt-get install tmux curl
    mkdir /root/stage
    cd /root/stage
    curl -LO https://github.com/yudai/gotty/releases/download/pre-release/linux_amd64.tar.gz
    mv gotty /usr/local/bin
    chmod a+x /usr/local/bin/gotty

We need tmux and gotty as these form the scaffolding for Professor Owl.

## screen + tmux = bff

To avoid nested tmux warnings, we're going to going to orchestrate everything
using screen with tmux being solely responsible for managing the session
between Professor Owl and the Student (gotty).

Start a new screen session (still as root) using `screen`. We'll assume you
kept the default of CTRL-A as the command key press for screen.

- Create a new window (CTRL-A + c)
- Name it `tmux-adm` (CTRL-A + A)
- Switch to the Professor Owl user account: `su -l prowl`
- Create the tmux session: `tmux new -A -s prowl`
- Create a new window (CTRL-A + c)
- Name it `tmux-ro` (CTRL-A + A)
- Switch to the Professor Owl user account: `su -l prowl`
- Setup gotty: `gotty --permit-write --credential secretuser:soopasecretpass --random-url tmux attach -r -t prowl`
- Create a new window (CTRL-A + c)
- Name it `control` (CTRL-A + A)
- Switch to the Professor Owl user account: `su -l prowl`
- Run Professor Owl: `scripts/demo.sh`

The above gotty configuration will allow the student to write to the terminal
when they have write access (more on this later). We try to provide some limit
security by requiring a username and password (warning: this not secure 
over http!) and requiring a random url.

Finally the actual command that gotty runs is to attach to our new `prowl`
tmux session as a read-only mode client.

## Testing check point

If there's no errors, then we're ready to test!

Copy the url in the gotty output

    2015/09/18 05:44:31 URL: http://your_digital_ocean_external_ip:8080/secreturl/

And paste it into a web browser, after you've logged in you should now be 
presented with a tmux shell. If it's configured correctly you'll also be 
unable to type anything.

## Preload ProfessorOwl with frequently used images

If you plan to follow the default curriculum, then we recommend you 
`docker pull` the following images to improve the docker experience of the 
students:

- hello-world
- docker/whalesay
- nginx:latest
- wordpress:4.3-fpm
- mariadb:5.5

Please note the version tags where specified are mandatory. This is to ensure
compatibility with current curriculum.

## Running ProfessorOwl

TODO
