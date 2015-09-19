# The aim

Add support for internal docker aliases. Commands in docker can take several arguments and having a way to alias some of them can definitly save time!

The syntax is mainly inspired from the git alias features

# The command

The way you can control aliases:

    docker alias --help 
    
    Usage:  docker alias [OPTIONS]
    
    Manage the aliases
    
      -d, --delete=       Delete the specified alias
      -e, --expand=       Expand the specified alias
      --help=false        Print usage
      -l, --list=false    List all aliases

## docker alias <name> <command...>

To add an alias you must specify the name and the command you want as substitution. Note that if your command starts with a ! the subsitution commands will be detached in a separate shell.

## docker alias -d <name>

Remove the specified alias

## docker alias --expand <name>

Show the substituion commands. Definitly needed for autocomplete purpose.

## docker alias --list

Show the existing aliases. Definitly needed for autocomplete purpose.

## docker alias

Show the aliases and there substitution commands

# How

The aliases are stored in the docker configuration file, respceting the DOCKER_CONFIG property if it is set.

# Must have
    : remove stopped containers
    docker alias clean '!f() { docker rm $(docker ps -a -q) ; } ; f'
    
    : returns the ip of a container
    docker alias ip '!f() { docker inspect $1 | grep IPAddress | cut -d \" -f 4; }; f'
    
    : start a bash on a running container
    docker alias join '!f() { docker exec -it $1 /bin/bash ; } ; f'
    
    : return the last container id
    docker alias last ps -l -q
    
    : starts your favorite container and join
    docker alias ubuntu run -i -t --rm ubuntu /bin/bash
    
    : go on strike and shutdown docker
    docker alias onstrike '!f() { sudo service docker stop ; sudo service docker status ; } ; f'
    
    : go at work and start docker
    docker alias atwork '!f() { sudo service docker start ; sudo service docker status ; } ; f'
    

