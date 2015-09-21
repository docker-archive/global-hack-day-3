AppIT Specifications
=== 
git for Desktop Application Environments.

Goal of this project is to launch the idea of docker for general users still operating on single Desktops.   

# Inspiration 
- IDE Synchronization (Netbeans,Eclipse)
	- I don't work on java projects but when I do, I should be able to do it from anywhere
- Good for layman, who just want to boot up and do their work. 
	- matlab, research projects ... 
- Promotes minimalistic or Batteries included but swappable approach to hosts 
- Gives you certain security,isolation,portable guarantees which is good for a user. 
- Make it easy for user.

# Features  
## Application Containment 
- Can Contain any sort of application (be it single container or multiple container)
- All your customizations and data should be with you, while you launch an application. (Persistent State)
- Define what each container is capable of 
	- Resource Usage 
	- Security Profiles 
	- Capabilities 

## Application Distribution 
- Freedom to create your own customizations and push it into docker hub. 
- Download only signed & trusted applications to your machine. 
- Application meta-data synchronization with cloud storage services 

## Usability Design 
- Can easily define interfaces to interact
	- Network ports 
	- ssh tunneling 
	- vnc 
	- sharing Xwindow Socket 
- Design 
	- pull,push,search for your application (powerful cli)
	- creating launchers which makes using applications intuitive 
	- gui wrappers to make it look like a package manager  	

# Technical Structures 
## Data Containers 
	- MetaData  -- Sync 1/0
	- ApplicationData -- Sync 1/0
	- LocalDataVolumes Sync 0 
