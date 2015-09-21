# Docker global hack day #3 - Docker pull dry-run

Add the ability to "dry run" a "docker pull" command, obtaining only the total size of image layers that have to be downloaded.

# Team

[Yann Gravrand](https://twitter.com/ygravrand) / [Sylvain Révéreault](https://twitter.com/srevereault)

# Source code

Source code can be found in the docker directory or in the https://github.com/srevereault/docker repository. Matching Pull Request on docker master is TODO.

# Known limitations

Currentlty only works with v2 registry. 

Does not work if a background pull is already running on the same image (but displays a nice warning ;-) ).

# History 

2015-09-21 - Initial version for Docker global hack day #3 

-------

# NAME
       docker-pull - Pull an image or a repository from a registry

# SYNOPSIS
       docker pull [-a|--all-tags[=false]] [-d|--dry-run[=false]] [--help] NAME[:TAG] | [REGISTRY_HOST[:REGISTRY_PORT]/]NAME[:TAG]

# DESCRIPTION
       This  command  pulls down an image or a repository from a registry. If there is more than one image for a repository (e.g., fedora) then
       all images for that repository name are pulled down including any tags.

       If you do not specify a REGISTRY_HOST, the command uses Docker's public registry located at registry-1.docker.io by default.

# OPTIONS
	-a, --all-tags=true|false
	  Download all tagged images in the repository. The default is false.  
	-d, --dry-run
	  Don't download the image layers. Only display the total size to be downloaded 
	--help
	  Print usage statement

