# ScaleSwarm

Docker Swarm is a very powerful clustering tool, but it has one shortcoming. The cluster needs to be manually set up and configured. Whenever the swarm capacity is full, a new docker host needs to be attached to the cluster. This is something which can be intelligently automated. Whenever Swarm runs out of resources, it invokes Machine to provision new resources(docker hosts). Machine and Swarm are individually very powerful tools, but when linked together, they can do much more powerful things. Here, to setup an AWS Docker Auto Scaling cluster, all you need is swarm, machine and Amazon API Keys. No more manual configuration of hosts or a cluster setup.

This hackathon project is a prototype and a proof of concept, rather than a well designed solution.

In the current stage, ScaleSwarm is not configurable and everything is completely hardcoded. It works only with AWS. Whenever the swarm runs out of resources, and a container is scheduled, it automatically provisions a `t2.micro` AWS instance. It does not use any special API for AWS (like EC2 Auto Scaling Groups), so it can be extended for other providers as well.

If swarm develops a plugin/extension system, this can be plugged into swarm as an extension, but currently it is just a hacky, modified version of swarm.
