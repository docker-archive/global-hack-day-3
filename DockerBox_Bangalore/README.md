# DockerBox
Ridiculously simple system way deploy and test micro-services. It's an internal heroku for your company.

DockerBox is an PAAS solution for setting up a QA or DevInt environment of a company. It can be deployed in a server and can add more servers to the cluster it forms using Docker Swarm. It uses Docker-compose for deploying distributed apps.

* Demo: [www.dockerbox.in](http://www.dockerbox.in)
* Presentation: [Slideshare](https://www.slideshare.net/secret/kqeCXmXf9YFcS8)

## Usage

* This can be used as a QA and Integration Testing environments of a company. Where the developers and QA engineers can enjoy the liberty to launch and delete as many instances of there application for testing or developer integration.
* Distributed apps can be tested by defining the relation between them. Please refer the screenshots.
* Images of the server can be defined by dockerfiles.
* Authentication is via Google Apps.


## Installation
#### Hosting in AWS

* Launch an ec2 instance for the Dockerbox-Master server with ubuntu 14.04 image

![](https://raw.githubusercontent.com/dockerx/global-hack-day-3/master/DockerBox_Bangalore/screenshots/AWS_launch_AMI.png)

* Add the security group to accept all TCP connection from anywhere.

![](https://raw.githubusercontent.com/dockerx/global-hack-day-3/master/DockerBox_Bangalore/screenshots/AWS_launch_Securitygroup.png)

* SSH into the created Dockerbox-Master and switch to root user before running the following command (sudo su or sudo -i):
```sh
curl -sSL https://raw.githubusercontent.com/dockerx/global-hack-day-3/master/DockerBox_Bangalore/install-master.sh | sh
```
* DockerBox is now up and running. Go to http://Dockerbox-Master_public_ip
* Register a wildcard domain (eg *.dockerbox.in) and map it to Dockerbox-Master_public_ip. If you don't want to register, it can be managed with your internal DNS as well.
* Open the application with the registered domain.
* Login to your application for the first time with the following credentials  
```yaml
Name: admin
Email: admin@dockerbox.in
```
* Go to the configuration page /admin/configuration
* Give the internal and public ip of the Dockerbox-Master at `cluster.master` of the JSON data in configuration page and update. Refer configuration for more options. Also add `gauth.domain` and `domainName` accordingly.
* Now the dockerbox environment is ready with single server in the cluster.
* Instruction for adding more servers to the cluster is given in the bottom of the configuration page


## Screenshot

![Screenshot of the DockerBox Login](https://raw.githubusercontent.com/dockerx/global-hack-day-3/master/DockerBox_Bangalore/screenshots/login.png)
![Screenshot of the DockerBox Landing page](https://raw.githubusercontent.com/dockerx/global-hack-day-3/master/DockerBox_Bangalore/screenshots/landing_page.png)
![Screenshot of the DockerBox Host creation](https://raw.githubusercontent.com/dockerx/global-hack-day-3/master/DockerBox_Bangalore/screenshots/host_create.png)
![Screenshot of the DockerBox Image creation](https://raw.githubusercontent.com/dockerx/global-hack-day-3/master/DockerBox_Bangalore/screenshots/image_create.png)

## Configuration

* `gauth` : The propertie to give the GAuth credentials
* `gauth.domain` : This is for giving the complete name of hosted domain of DockerBox. Eg: `www.dockerbox.in` or `beta.companyname.com` etc.
* `gaTrackingId` : Google analytics tracking ID (Optional)
* `domainName` : The registered domain name. 
  - `dockerbox.in` where the wildcard domain is registered as ```*.dockerbox.in```
  - `beta.companyname.com` where the wildcard domain is registered as ```*.beta.companyname.com```
* `admin`[Array] : List of Admin emails.
* `underMaintenance`[Boolean] : If true only the Admins can access your DockerBox installation.
* `cluster.master` : The master server Public and Internal(private) ips.
* `cluster.nodes`[Array] : List of cluser nodes Public and Internal(private) ips

##### For adding a new server to the cluster
* Launch a new EC2 instance same like Dockerbox-Master.
* SSH into this new server and run the below command after becoming the root user by running `sudo su`
```sh
curl -sSL https://raw.githubusercontent.com/dockerx/global-hack-day-3/master/DockerBox_Bangalore/node-setup.sh | sh -s <Dockrbox_Master Internal IP>
```
* Add the Public and Internal Ip of the new server to the `cluster.nodes` list in the format `{"internal_ip" : "", "public_ip" : ""}`

## Author
* Alan Joseph ([@alanjoxa](github.com/alanjoxa))
* Fayiz Musthafa ([@fayizk1](github.com/fayizk1))

Feel free to write to us for any issues or support. PRs welcome!

## License
MIT License
