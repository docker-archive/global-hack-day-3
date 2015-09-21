dockerComp
==========

- Youtube Video Explaining this project:
  
  [![Here's a video for DockerComp](http://img.youtube.com/vi/lIp2nrOnKFs/0.jpg)](http://www.youtube.com/watch?v=lIp2nrOnKFs)

- [Click here](http://asciinema.org/a/13557) for Screencast for running just one script on client side. 


**NOTES**

- Demo link to be updated soon. 

- In case you're curious how to go about running this from client side:
 
  - So once the server is up and running, all one has to do is download and run installer.sh

- Docker Image: ``` $ docker pull arcolife/docker_comp ``` (will be kept updated)


**GOAL**

To setup a basic prototype for distributed computing in docker. If time permits, add a complex 
computing task.

**FAQ**

Refer to Wiki .. [click Here!](https://github.com/arcolife/dockerComp/wiki).

**INTRODUCTION**

For the purpose of Distributed (Scientific) Computing, scientists across the world have been 
mostly using pre-configured VM images to let the client volunteer in contributing 
towards micro-processing tasks  that involve processing of raw data received in 
chunks over the network. 

But, since the introduction of Docker, life has changed and so have the performance 
benchmarks. We propose an system that uses the benefits of Docker to hopefully perform 
far better than the currently achieved milestones through VMs. The VMs have a huge 
overhead of starting up, as compared to Docker containers. Moreover, we don't even need 
to explain the difference between running more than one VM on a HostOS compared to 
running multiple docker containers on that same machine! See the point? :)

References: 

     - http://www.rightscale.com/blog/sites/default/files/docker-containers-vms.png 
     - http://en.wikipedia.org/wiki/Docker_%28software%29#cite_ref-3

So, just to give you a context of this whole project, take a look at this project called
[CernVM](http://cernvm.cern.ch/portal/). This is a really awesome project, developed to
help collect CERN's LHC data and perform data analysis on a volunteer's computer or even on
commercial clouds. Just imagine if the whole process of using VM was dockerized!    
 

**FEATURES**

- Can be used for:
      - Image Processing
      - General Data Analysis
      - Scientific Computing
      - CrowdSourcing projects.


**FUTURE GOALS** 

- Make this a pluggable dockerized distributed computing tool, where you just have to include 
  a compution task (say, map-reduce) and make it send data to clients. The app should be able 
  to handle the rest.

- Benchmark results and compare with existing methodologies. 

**STEPS**

- Server side (src/server/):

  - Make sure that your 'src/server/' is up and running, either locally (for test purpose), 
     or if its deployed elsewhere, then the hostname/IP and Port is provided in the environment 
     variables as under `$DC_HOST` and `$DC_PORT`.

     (refer next major point on 'Client side' for this script)

  - Do ensure that for running the server, you need to install mongoDB. Refer to following: 
    [install_mongo guide](https://github.com/arcolife/dockerComp/blob/master/src/server/install_mongo)
    and then set the env variables `U_DB, U_USER and U_PASS` giving the same values to them as the
    db name, it's user and password set while setting up mongoDB.


  - Ensure that you've installed deps from `dockerComp/src/server/requirements.txt`

  - To run the src/server, open up a terminal, go to dockerComp/src/server/ and run ```$ ./start```
    This starts the server locally on your machine.


- Client side (src/client/):

  - Download [This Script](https://github.com/arcolife/dockerComp/raw/master/installer.sh) and run 

  ```$ ./installer.sh``` [configure your Server location for this script, as under `$DC_HOST` & `$DC_PORT` ]

Cheers! :)

Note: For server side deployement (i.e., the server that basically is responsible for distributing data 
      to clients), It has to be deployed somewhere and it's IP has to be provided in your installer.sh. 
      And then you may distribute the script to the clients. 

**TESTS**

- From client side:
  - although the default connection establishment test is included with install scripts;
    run ```$ src/client/scripts/test.sh``` (make sure env vars `DC_HOST` and `DC_PORT` are set)

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
