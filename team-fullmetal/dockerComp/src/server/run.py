#!/usr/bin/python
# -*- coding: utf-8 -*-

##############
# dockerComp #
##############
from app import app
from app.models import *
from flask import \
    Flask, \
    render_template, \
    Response, \
    json, \
    jsonify, \
    make_response, \
    request, \
    redirect, \
    session, \
    abort, \
    send_from_directory

from config import \
    HOST, \
    PORT, \
    DEBUG,\
    TEMPLATE_CONFIGURATION

from random import randrange
import netaddr

import subprocess
from subprocess import call
# from subprocess import check_out

@app.route('/', methods=['GET'])
def home():
    """
    dockerComp Container Management dashboard
    """
    try:
        #print request.path
        assert request.path == '/'
        print request.headers['Host'], request.method
        all_objects = Client.objects.all()
        docker_arr = {}
        for client_obj in all_objects:
            docker_arr[client_obj.ip_addr] = { 
                'container_count': len(client_obj.containers),
                'container_details' : {} 
            }
            for container_id in client_obj.containers:
                docker_arr[client_obj.ip_addr]['container_details'][container_id] = [
                    client_obj.containers[container_id].container_name,
                    client_obj.containers[container_id].container_ip_addr,
                    client_obj.containers[container_id].container_port
                ]
        return render_template("stats.html",
                               total_clients=Client.objects.count(),
                               docker_arr=docker_arr)

    except:
        abort(404)
        
@app.route('/<container_id>/')
def listener(container_id=None):
    """
    listens for possible connections
    made by container.
    """
    pass

def data_generator():
    """
    generates random datasets.
    """
    temp = []
    for i in xrange(10):
        temp.append((randrange(100),
                     randrange(100)))
    return temp

def integrity_checker(container_id=None, data=None):
    """
    checks and verifies data sent over by  containers
    """
    current = Client.objects.get(container_id=container_id)
    
@app.route('/connect/<client_IP>/<container_id>/', methods=['GET','POST'])
def communicator(container_id=None, client_IP=None):
    """
    communicates with the client
    """
    if request.method == 'POST': 
        pass
    elif request.method == 'GET':
        pass


@app.route('/test/server/', methods=['POST'])
def test():
    print request.host
    return "\n>>>> Server: Client POST request OK Tested" #jsonify({'got response from client': 'OK'})

@app.route('/get_details/', methods=['POST'])
def get_tasks():
    received = json.loads(request.data)
    ip_addr = request.environ['REMOTE_ADDR']
    ip_addr_num = netaddr.IPAddress(ip_addr).value

    try:
        temp_client = Client.objects.get(ip_addr=ip_addr)
    except:
        temp_client = Client(ip_addr=ip_addr,
                             ip_addr_num=ip_addr_num)

    for data in received:
        try:
            container_port = data['NetworkSettings']['Ports']\
                             ['80/tcp'][0]['HostPort']
        except:
            # the containerized app was exposed on port 80
            container_port = '80'

        container_id = data['Config']['Hostname']
        container_name = data['Name']
        print container_name
        container_ip_addr = data['NetworkSettings']['IPAddress']
        temp_container = Container(container_name=container_name,
                                   container_ip_addr=container_ip_addr,
                                   container_id=container_id,
                                   # config=data)
                                   container_port=container_port)

        temp_client.containers[container_name] = temp_container

    temp_client.save()

    #print temp_client.to_json()
    print request.host
    return '\n>>>> Server: container metadata received..\n'

####
## Keep track of important records
####

num_machines = 0
docker_arr = []

@app.route('/dockers/stats', methods=['GET'])
def docker_stats():
    try:
        #print request.path
        # assert request.path == '/'
        print request.headers['Host'], request.method
        # return render_template(jsonify({"num_machines":num_machines,"docker_arr":docker_arr}))
        return render_template("stats.html",
                               x={"num_machines":num_machines,"docker_arr":docker_arr})
    except:
        abort(404)

# deamon runs the computing tasks in a round-robin fashion
@app.route('/assign/all', methods=['POST'])
def assign_all():
    # dockerIDs = check_output(["docker","ps","-q"])
    # print type(dockerIDs)
    # print dockerIDs
    while(True):
        p = subprocess.Popen(["docker", "ps", "-q"], stdout=subprocess.PIPE)
        out, err = p.communicate()
        num_machines = len(out.split())
        docker_arr = []
        for index,i in enumerate(out.split()):
            info = subprocess.Popen(["docker","inspect",i], stdout=subprocess.PIPE)
            info_out, err_out = info.communicate()
            cip = json.loads(info_out)[0]['NetworkSettings']['IPAddress']
            data = data_generator()
            # print data
            # print "****"
            num = subprocess.Popen(["./scripts/test_client.sh",cip,str(data)], stdout=subprocess.PIPE)
            num_out, num_err_out = num.communicate()
            print num_out
            # print len(out.split())-index-1
            docker_arr.append({'dockerID':i,'dockerInstanceIP':cip})

        # print "****"
        # subprocess.Popen(["curl","-H","Content-type: application/json","-X","POST","http://"+cip+"/tasks","-d",str(data)], stdout=subprocess.PIPE)
        # curl -H "Content-type: application/json" -X POST http://$1/tasks/ -d "$2"



if __name__ == '__main__':
    try:
        app.run(host = HOST,
                port = PORT,
                debug = DEBUG)
    except:
        raise
