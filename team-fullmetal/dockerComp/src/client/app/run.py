#!/usr/bin/python

import ast
import os, sys
from flask import Flask, jsonify, request, Response

import subprocess
from subprocess import call

import socket
import requests, json

app = Flask(__name__, static_url_path='')


@app.route('/', methods=['GET'])
def home():
    return jsonify({'client_test': 'OK'})


@app.route('/test/client/', methods=['POST'])
def test():
    print request.data
    return jsonify({'got response from server': 'OK'})

@app.route('/tasks/', methods=['POST'])
def get_tasks():
    received = ast.literal_eval(request.data)
    #print received[0]
    result = 0
    for i in received:
        result += sum(i)
    return Response(str(result))

@app.route('/get_task', methods=['POST'])
def get_task():
    while(True):
        ip = socket.gethostname()
        p = subprocess.Popen(["./scripts/request_task.sh",ip], stdout=subprocess.PIPE)
        out, err = p.communicate()
        ######## add stuff ########

if __name__ == '__main__':
    try:
        app.run(host = '0.0.0.0',
                # port = 80,
                debug = False)
    except:
        raise
