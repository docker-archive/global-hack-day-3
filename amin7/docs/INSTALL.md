## Install Guide

This guide assumes you have already [provisioned](PROVISION.md) your fleet according to the guide.

### Master Node
On your master machine running Ubuntu 14.04, you need to do the following to start the installation process:
- Install Git: ```sudo apt-get install git```
- Clone the Chorus Repo: ```git clone https://github.com/niall-byrne/chorus.git```
- Create a .chorus folder in your home folder: ```mkdir ~/.chorus```
- Create a private/public key pair, and distribute the public key to the authorized_keys file on all worker machines.
- Make sure all workers have a common SSH user, who has NOPASSWD sudo, and is in the Docker Admin group.
- Edit the install.sh file, to point ot the PEM file location, and to set the username that will be used ```vi install.sh```

### Determine Which Installation Method to Use

You have three methods available for provisioning your fleet:

- If you used a dedicated subnet for your machines, you can simply attempt to install the webservice on the entire subnet, and no further configuration is required.  Use this method only if is no other infrastructure on the subnet.  This is the recommended method, and easiest to maintain and provision.  If you can segregate a subnet or VPC for this purpose, choose this method.

- If you have a mix of worker machines, and other infrastructure on your subnet, you should compile a list of the IP addresses of your worker machines and create an Ansible Inventory File.  You will have a bit of administrative overhead to maintain the inventory file as new hosts are created in your fleet.

- If you are using AWS, or another cloud environment that supports shapshotting.  Simply provision a fleet of one machine.  You can snapshot your worker node with the webservice installed, and spawn more instances.  You'll have to manually edit your Chorus cache file to reflect the workers present in the environment.  ```vi ~/.chorus/cache```

### Subnet Based Install (All subnet machines are Ubuntu Machines Running Docker)

To point Chorus at a subnet of machines, simply specify the CIDR of your subnet in the Chorus subnet file.  
- Edit the subnet file:  ```vi ~/.chorus/subnet``` and enter the CIDR (ie. 192.168.99.0/24)
- Run the install script: ```bash install.sh```, go get a coffee and come back to fleet of machines.
- Verify webservice is running on all machines:  ```chorus hosts```

### Selective Install (There is a mix of Ubuntu machines running Docker and other machines on your subnet.)

To selectively install Chorus on certain machines, you'll need to create your own ansible inventory file.
- Create your inventory file: ```vi inventory```
- Create lines in your inventory file for each machine you'll be provisioning.  Here's a template to follow:

    ```
    [ chorus ]
    10.0.0.1     ansible_ssh_user=ubuntu ansible_ssh_private_key_file=/home/ubuntu/.ssh/mypemkey.pem
    10.0.0.2     ansible_ssh_user=ubuntu ansible_ssh_private_key_file=/home/ubuntu/.ssh/mypemkey.pem
    10.0.0.3     ansible_ssh_user=ubuntu ansible_ssh_private_key_file=/home/ubuntu/.ssh/mypemkey.pem
    ```

- Run the install script, pointing to your inventory file: ```bash install.sh inventory```, go get a coffee.
- Verify webservice is running on all machines: ```chorus hosts```

### Cloud Based Image Provisioning.

This is a hybrid approach where you provision exactly one machine according to the Selective Install method.  You can then create an AMI of this machine, and spawn copies.  Once all your spawned instances are up:
- Edit the Chorus cache file, and simply list all the ip's of all machines.  ```vi ~/.chorus/cache```
- Verify webservice is running on all machines:  ```chorus hosts```

