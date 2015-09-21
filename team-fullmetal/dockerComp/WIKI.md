**FAQ**

- So what is dockerComp again? how do you better achieve distributed computing?

basically, I've introduced dummy data right now. But when the workloads/actual agents are added, 
we hope to achieve better performance than VMs as theory shall indicate.

- Whats to be done to enhance the prototype?

I didn't have the agent that runs inside VM, any dummy workload you may put, that distriubutes data from server
to the clients and further to N number of containers inside each client and then they use the client's CPU
to analyse and return results.

- Is there anybody doing that already?
 
No one as far as I know. Docker is new, atleast in scientific community, as per the best of my knowledge. 
[google searches and blog reads ( :D )].  Everything currently runs directly on servers or in VMS.
But what does it matter? Do it better in this manner. #UNIX philosophy. 
Don't worry. Facebook/Google wouldn't have existed if they weren't better than the rest. Just saying!

- What's more in the closet?

Imagine if that crowd sourced analysis could be done efficiently, in lesser time and also, being able to analyze more data in that time being able to run multiple agents (within multiple containers) on multiple clients and being able to control 
the number of containers launched per client that would increase even the chances of finding aliens :D through the SETI project that uses crowd sourcing. They all run things like BOINC and stuff that ultimately runs inside a VM. I really wish to take this further 
and finish this as a pluggable dockerized generalized distributed computing framework

- So where does the app run ultimately?

It runs inside Linux machines (Ubuntu/Fedora) ..i.e., RPM or DEB based systems. 
It currently doesn't run on Mac. We need to add suport for that. 

I made a basic prototype that launhes certain No.# of containers and makes it easy simple users 
by having to run just one script at the end ```installer.sh``` . No downloading cernVMs, 
no downloading oracle virtual boxes nothing, just one simple script..

- Something you should know..

I was facing problem with running the app on client in proxied networks. Since then, it's difficult to initiate request 
from outside, especiially if its a PAN/NAT network type. So, I sought to initiate the request from client and keep it 
alive and let the server communicate with client in that manner.
the server IP is hardcoded inside client's test script for checking connection to server. Needs to be changed

- ..but usually servers should initiate the connection, right?

Right. need to work on that.. tunneling I guess.. I didn't have time and resources for that. Contributions are welcome!

- Task Workflow 

If there are different tasks, there will be a task ID thats tracked on server inside MongoDB. Right now i'm launching 
a fixed no. of containers on a client; like 4 docker containers. This needs to depend on the h/w config on the client
otherwise it will hang the CPU 

- TODO

make a daemon on client side, that keeps track of containers and allots CPU power and also communicates metadata with server.


**TESTS**

- From client side:
  - although the default connection establishment test is included with install scripts;
    run ```$ ./src/client/test.sh```

- From server side:
  - TBD

- Workloads:
  - Currently a simple task. TBD.


**WORKFLOW**

1. Server

   - Dashboard to Manage:
     - No. of Clients (and # of containers per client)
     - Resources allocated to the containers
   
   - Master app  that manages data sent to each client and checks for integrity.

2. Client

   - Installation of Docker
   - Starting Containers
   - Installation of Application inside the Container
   - Connection Establishment with the Server.
   - Scripts for the computation
   - Error Reporting

**REFERENCES**

1. https://github.com/cernvm
2. http://en.wikipedia.org/wiki/List_of_distributed_computing_projects
3. http://www.rightscale.com/blog/sites/default/files/docker-containers-vms.png 
4. http://www.psc.edu/science/
5. http://pybossa.com/
6. https://okfn.org/press/releases/crowdcrafting-putting-citizens-control-citizen-science/
7. http://www.mediaagility.com/2014/docker-the-next-big-thing-on-cloud/
8. http://cernvm.cern.ch/portal/
