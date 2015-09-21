FEATURES
========

### General

- [ ] Authentication/Key signing process for client-server
- [ ] Registering of client/workers
- [ ] Authentication for arcolife/docker_comp image (notary)
- [x] Test integration with Docker Compose / Kube
- [ ] Use ansible/likes to test S/W stack setup
- [ ] add perf counters
- [ ] setup logging
- [ ] test integration with tor n/w and intelligent task distribution with independent cluster management.

### SERVER

- [ ] Purging of clients/workers
	- [ ] take care of edge cases (connection drop/retrial)
- [ ] Server side daemon to divide data in chunks and distribute to clients
	- [ ] integrate crunched data
	- [ ] integrate Task Manager / Queue on server

- [ ] load-balancing for workloads based on stats from clients 

- [ ] accept config changes from clients on the fly

- [ ] Integrate Server side Web console to keep track of clients
	- [x] add minimalistic UI
	- [x] integrate with MongoDB 
	- [ ] integrate plugin with cAdvisor to administer clients from UI rather than just monitor them.

### CLIENT

- [ ] Client side daemon to distribute workload to workers
	- [ ] decide IP and other env sharing process (container links/aliases)
	- [ ] shutdown / manage resource intelligently 
	- [ ] Polling the server (if server goes down) and initiate KEEP_ALIVE

- [ ] provide an option (like manifest file) for client to change
- [ ] configure client daemon to reload on changes to this file


BUGS (or possible ones) 
=======================

- [ ] PAT/NAT routing - issue #1
	- [ ] OpenVPN testing
 
ENHANCEMENTS
============

- [ ] Task Distribution redundancy 
- [ ] integrate cernvm
	- RPM/updates
	- AFS
	- ROOT
	- Contextualization
	- fuse-FS integration without privileged mode (refer vault volume plugin)
	- Define tuned config 
	- C++11 Compiler
	- Makeflow

- [ ] integrate PyBossa
	- deploy sample app (face recog?)
