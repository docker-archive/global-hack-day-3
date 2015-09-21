# Design details of EMC ScaleIO implemtation

##ScaleIO support for different options (profiles) for volumes.

##Code
```
https://gist.github.com/wallnerryan/577a14ff5b3d31f4c3c0
https://github.com/hackday-profilers/global-hack-day-3/tree/scaleio-docs
https://github.com/emccorp/scaleio-flocker-driver/tree/scaleio-profiles-hackday
https://github.com/wallnerryan/scaleio-py/tree/profiles_scaleiopy
```

(*supported options in PoC Hack)
##Available Options
- *IOPS
- *Bandwidth
- *Per Volume Ram Cache
- Thin/Thick P
- Storage Pool Priority
- Fault Domain Priority

## How to provsion

```flocker-volumes --node=<nodeID> -s 8589934592 --metadata="name=myvol@gold"```

##### or via Docker

```docker run -ti -v myvol@gold:/data --volume-driver=flocker busybox sh```

## How to Run the Example

(These instructions do not include setting up flocker-docker-plugin or docker, please see https://docs.clusterhq.com/en/1.3.1/labs/docker-plugin.html)

## ScaleIO

ScaleIO
```
git clone https://github.com/wallnerryan/scaleio-vagrant-profiles
cd vagrant-scaleio
vagrant up
vagrant ssh mdm1
sudo su
systemctl enable firewalld
systemctl start firewalld
firewall-cmd --permanent --direct --add-rule ipv4 filter FORWARD 0 -j ACCEPT
firewall-cmd --direct --add-rule ipv4 filter FORWARD 0 -j ACCEPT
# Docker port
firewall-cmd --permanent --zone=public --add-port=4243/tcp
# ScaleIO ports needs to be open
firewall-cmd --permanent --zone=public --add-port=6611/tcp
firewall-cmd --permanent --zone=public --add-port=9011/tcp
firewall-cmd --permanent --zone=public --add-port=7072/tcp
firewall-cmd --permanent --zone=public --add-port=443/tcp
firewall-cmd --permanent --zone=public --add-port=22/tcp
# Flocker ports
firewall-cmd --permanent --zone=public --add-port=4523/tcp
firewall-cmd --permanent --zone=public --add-port=4524/tcp
firewall-cmd --reload
```

(Make sure ScaleIO Cluster is all the way up first)
## Flocker Node
```
git clone https://github.com/wallnerryan/profiles-poc
cd profiles-poc
(Enable Flocker Dev Node to connect to ScaleIO)
git clone -b profile_metadata https://github.com/ClusterHQ/flocker
cd flocker/flocker
cp ../../flocker-Vagrantfile ./Vagrantfile
cp ../../numactl-libs-2.0.9-4.el7.x86_64.rpm .
cp ../../libaio-0.3.109-12.el7.x86_64.rpm .
cp ../../EMC-ScaleIO-sdc-1.31-243.0.el7.x86_64.rpm .
vagrant up
vagrant ssh
cd /vagrant/
sudo su
rpm -i libaio-0.3.109-12.el7.x86_64.rpm
rpm -i numactl-libs-2.0.9-4.el7.x86_64.rpm 
rpm -i EMC-ScaleIO-sdc-1.32-403.2.el7.x86_64.rpm 
/usr/bin/emc/scaleio/drv_cfg --add_mdm --ip 192.168.50.12

(Install Flocker from Source)
yum -yy install epel-release openssl openssl-devel libffi-devel python-virtualenv libyaml clibyaml-devel
virtualenv venv
source venv/bin/activate
/vagrant/venv/bin/python setup.py install
```

## Configure Flocker
```
mkdir /etc/flocker
cd /etc/flocker
/vagrant/venv/bin/flocker-ca initialize mycluster
/vagrant/venv/bin/flocker-ca create-control-certificate mycluster.localdomain
cp control-mycluster.localdomain.crt control-service.crt
cp control-mycluster.localdomain.key control-service.key
/vagrant/venv/bin/flocker-ca create-api-certificate vagrantuser
cp vagrantuser.crt user.crt
cp vagrantuser.key user.key
chmod 0700 /etc/flocker
chmod 0600 /etc/flocker/control-service.key
/vagrant/venv/bin/flocker-ca create-node-certificate
ls -1 . | egrep '[A-Za-z0-9]*?-[A-Za-z0-9]*?-[A-Za-z0-9]*?-[A-Za-z0-9]*?-[A-Za-z0-9]*?.crt' | xargs -I {} cp {} /etc/flocker/node.crt
ls -1 . | egrep '[A-Za-z0-9]*?-[A-Za-z0-9]*?-[A-Za-z0-9]*?-[A-Za-z0-9]*?-[A-Za-z0-9]*?.key' | xargs -I {} cp {} /etc/flocker/node.key
chmod 0600 /etc/flocker/node.key

mkdir /opt/flocker
cd /opt/flocker
git clone -b profiles_scaleiopy https://github.com/wallnerryan/scaleio-py
git clone -b scaleio-profiles-hackday https://github.com/emccorp/scaleio-flocker-driver


cd scaleio-flocker-driver/
/vagrant/venv/bin/python setup.py install

cd ../scaleio-py
(might need to repeat, or pip install instead)
/vagrant/venv/bin/python setup.py install

touch /etc/flocker/agent.yml
cat <<EOT >> /etc/flocker/agent.yml
version: 1
control-service:
  hostname: "localhost.localdomain"
dataset:
  backend: "scaleio_flocker_driver"
  username: "admin"
  password: "Scaleio123"
  mdm: "192.168.50.12"
  protection_domain: "pdomain"
  storage_pool: "pool1"
  ssl: True
EOT

/vagrant/venv/bin/flocker-control --verbose > /tmp/control.log 2>&1 &
/vagrant/venv/bin/flocker-container-agent --verbose > /tmp/container.log 2>&1 &
/vagrant/venv/bin/flocker-dataset-agent --verbose > /tmp/data.log 2>&1 &
```

## Install flocker-tools
```
virtualenv --python=/usr/bin/python2.7 /opt/flocker/flocker-tools
/opt/flocker/flocker-tools/bin/pip install git+https://github.com/clusterhq/unofficial-flocker-tools.git
cd /etc/flocker
```

## Run flocker commands.
```
/opt/flocker/flocker-tools/bin/flocker-volumes --control-service localhost list-nodes
SERVER     ADDRESS   
7f719abb   127.0.0.1 

/opt/flocker/flocker-tools/bin/flocker-volumes --control-service localhost create --node=7f719 -s 8589934592 --metadata="name=test"
created dataset in configuration, manually poll state with 'flocker-volumes list' to see it show up.
```
Default is thickly provisioned with no cache
![alt tag](http://s8.postimg.org/nk1l7ut1x/normal.png)
![alt tag](http://s8.postimg.org/7xabuhf9x/provision_default.png)

```
/opt/flocker/flocker-tools/bin/flocker-volumes --control-service localhost create --node=7f719 -s 8589934592 --metadata="name=test@gold"
created dataset in configuration, manually poll state with 'flocker-volumes list' to see it show up.
```
