docker-record
=============

Getting your infrastructure to work properly in your Docker container is an iterative process that involves inital setup, tuning of configuration parameters, and eventual (infrastructure) testing in a trial and error fashion. Translating all the changes made to a container into a Dockerfile to allow for reproducible and transparent infrastructure is a cumbersome (and investigated empirically, painful) process. This process includes, among other things, a back-and-forth between container history and questions like 'What the f%!$k did I actually touch to get this thing running?'.

With docker-record we want to address this issue and provide a semi-automated way that takes us from getting our infrastructure up and running in our container to the reproducible and transparent definition of infastructure in a Dockerfile.

In that vein, you can start your infrastructrue setup/maintenance process with docker-record <CONTAINER>, that will initiate a bash session within your running container (similar to docker attach). You can easily exit out of docker-record for testing or any other purposes and start the process again. When you feel that you are done or want to see how the potential Dockerfile would look like, run docker-record <CONTAINER> --replay and the Dockerfile instructions will be shown on your screen (i.e., stdout).

Installation
------------
It's just a single python file right now, so get it in your path somehow.

Usage
-----

    # <CONTAINER> should be running

    docker-record <CONTAINER>
    # drop into a bash session
    apt-get update
    apt-get install some-package
    vim /etc/some.conf
    exit

    # does my container work now?
    # no...

    docker-record <CONTAINER>
    # try something else
    exit

    # does my container work now?
    # yes!

    # generate a dockerfile for whatever I just did!
    docker-record <CONTAINER> --replay


Screencast/Demo
----------------

We demonstrate our tool by taking a tutorial provided by DigitalOcean on how to setup nginx within a Docker container and generate the Dockerfile automatically from the instructions given in the tutorial.

Screencast: https://vimeo.com/139944015


Background/Overview
--------------------

When starting your setup/maintenance process with docker-record, with every issued command in your shell, we log (i.e., 'record') the command, working directory, user id, and environment variables. 
The Dockerfile can than be seen as the mapping between the gathered historical data and Dockerfile instructions. However, not every mapping is straight-forward, some require the use of heuristics to provide meaningful approximation.

The overall process can be summarized as follows:
- Instrument bash commands to gain a full history with execution context
- Extract log history from container
- Map bash commands + execution context to Dockerfile instructions
- Apply heuristics to extract additional Dockerfile instructions
- Apply heuristics to *eliminate* Dockerfile instructions

In the current, initial version resulting out of Docker Hack Day #3, we provide heuristics for detecting which 
files haven been affected and copy these files from the container to a build folder (BUILD_CONTEXT_PATH in docker-record source).
We also have a very simple heuristic that identifies what the CMD instruction might be.
During the hackathon we have brainstormed about further heuristics that are documented in Future Work. 

In the end, docker-record can only provide a suggestion (i.e., a semi-automated process) of what a Dockerfile can look like, since the mapping from history to Dockerfile instructions is in itself not bijective.

Future Work
-----------

- *Heuristics*: Further heuristics for the future include:
    * Integrating domain knowledge to avoid false-positives when identifying which file should be added to the build context, and automatically generating a .dockerignore
    * Suggesting VOLUME instructions based on file structures or, again, domain knowledge (e.g., mysql saves its logs in /var/log/mysql)
    * Analyze the history (most likely involves dependency analysis) and provide a suggestion for reordering of instructions that make the best out of the union file system and Docker caching mechanisms

- *Fine-grain diffs*: Run `docker diff` between every command. This can be done by [sharing a named pipe with the container] [1], writing to that pipe from the instrumentation code, and reading from it in the docker-record process, which would then call diff on every read. The session would have to be converted from a call to exec (see [this approach] [2]), so that the python process could read the pipe and run diff. Furthermore, adding volumes to an already running container is not yet supported, but may be in the [future] [3].

[1]: https://github.com/docker/docker/issues/14221#issuecomment-116618705
[2]: https://github.com/d11wtq/dockerpty/issues/30 "Maybe we could contribute to this other project."
[3]: https://github.com/docker/docker/pull/14242 "Look, a volume api!"
