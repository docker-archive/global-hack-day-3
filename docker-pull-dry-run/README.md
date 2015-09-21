# Docker global hack day #3 - Docker pull dry-run

Add the ability to "dry run" a "docker pull" command, obtaining only the total size of image layers that have to be downloaded.

# Team

[Yann Gravrand](https://twitter.com/ygravrand) / [Sylvain Révéreault](https://twitter.com/srevereault)

# Source code

Source code can be found in the docker directory or in the https://github.com/srevereault/docker repository, ``pull-dry-run`` branch. The matching Pull Request on docker master can be found here: https://github.com/docker/docker/pull/16450.

# Known limitations

Currently only works with v2 registry.

Does not work if a background pull is already running on the same image (but displays a nice warning ;-) ).

# Example

```
docker pull -d jenkins
Using default tag: latest
INFO[0005] POST /v1.21/images/create?dryRun=true&fromImage=jenkins%3Alatest
INFO[0008] Image manifest for jenkins:latest has been verified
**** Dry Run - nothing will be downloaded ****
latest: Pulling from library/jenkins
latest: Dry Run: 376344319 bytes to be downloaded, in 33 layers
Status: Dry Run completed for jenkins:latest
```

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
