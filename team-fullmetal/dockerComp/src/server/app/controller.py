from app.users.models import *
from datetime import datetime
 

def create_client(client_IP, containers):
    pass

def add_container(client_IP, container_id):
    pass
    
def purge_container(client_IP, container_id):
	# if user modified the config on the fly
	# then remove one of the containers and 
	# update this on The Channel
    pass

def purge_client(client_IP):
	# counter = 3
    pass

def add_data(data, container_id, client_IP):
    pass

def delete_data(container_id, client_IP):
    pass

def add_result(container_id, client_IP):
    pass
