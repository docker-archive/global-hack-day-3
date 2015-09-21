#!/usr/bin/python

__author__ = 'nbyrne'

# Creates an ansible inventory file for installing the Chorus webservice
# It writes the entire subnet to the file, so that an install is tried on all IP's

import netaddr
import sys


def main(subnet, keyfile, user):
    with open("inventory", "w") as f:
        f.write("[ chorus ]\n")
        for ip in netaddr.IPNetwork(subnet):
            f.write(str(ip)+"     ansible_ssh_user=%s ansible_ssh_private_key_file=%s\n" %
                    (user, keyfile))

if __name__ == '__main__':
    if len(sys.argv) != 4:
        print "Usage: python subnet-install.py [cidr] [ssh keyfile] [ssh user]\n\n"
        sys.exit(1)
    main(sys.argv[1], sys.argv[2], sys.argv[3])
