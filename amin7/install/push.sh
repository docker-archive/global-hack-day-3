#!/bin/bash

# Import and set Enivornment Variable to make parameter accessible by Ansible
export ANSIBLE_USER="$2"

# Run the Playbook
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i $1 site.yml

# Make the local cache file unique
cat ~/.chorus/cache | sort --unique > ~/.chorus/cache_new
mv ~/.chorus/cache_new ~/.chorus/cache
