#!/bin/bash

set -e

# Modify this to point to the key file needed to access the nodes
keyfile="~/.ssh/aws-pemfile.pem"
# Should have NOPASSWD sudo access to allow install of the webservice, and be in the docker group
remoteuser="ubuntu" 

if [ ! -z $1 ]; then
    if [ ! -f $1 ]; then
        echo "Inventory file not found."
        exit 1
    fi
else
    if [ ! -f ~/.chorus/subnet ]; then
        echo "For an automated install create your chorus subnet file (vi ~/.chorus/subnet)."
        exit 1
    fi
fi

echo "Installing dependencies ..."
sudo apt-get update 2>&1 > install.log
sudo apt-get install -y software-properties-common 2>&1 >> install.log
sudo apt-add-repository -y ppa:ansible/ansible 2>&1 >> install.log
sudo apt-get update 2>&1 >> install.log
sudo apt-get install -y python-pip ansible 2>&1 >> install.log
sudo pip install netaddr 2>&1 >> install.log

echo "Installing orchestra CLI ..."
sudo sudo ln -sf `pwd`/chorus.py /bin/chorus
sudo chmod +x chorus.py

echo "Installing remote webservice on all nodes ..."
if [ -z $1 ]; then
    echo "    No inventory file specified- using auto discovery mode."
    echo "    This will be very time consuming.  Expect some delay while this completes."
    subnet=`cat ~/.chorus/subnet`
    python install/subnet-install.py ${subnet} ${keyfile} ${remoteuser}
    cp inventory install
    cd install
    bash push.sh inventory ${remoteuser}
else
    cp "$1" install
    cd install
    bash push.sh $1 ${remoteuser}
fi

echo "All done."

