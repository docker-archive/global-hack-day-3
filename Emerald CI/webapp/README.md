Emerald CI Webapp
=================

Development
-----------

You need to have Docker and Docker-Compose installed.

You need to clone all the related git repositories from the [emerald-ci
org](https://github.com/emerald-ci) on GitHub.

Then build the docker images for each git repo. There should be a `Makefile` in
each repo that builds the image. So just run

	make

in each repo and you should be all set.

Then build and run this project.

	docker-compose build
  docker-compose up

> Hint: this might fail, but don't worry, just run `docker-compose up` again,
> sometimes setup of the dependent services take longer and an applications
> boot fails because it cannot connect to it.

Now you can start hacking! :D

