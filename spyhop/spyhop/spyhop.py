#!/usr/bin/env python
from flask import Flask, jsonify
from api import get_container_stats, get_all_containers, \
    get_curated_stats
import json

app = Flask(__name__)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/<container_id>')
def stats(container_id):
    container_stats = get_container_stats(container_id)
    return jsonify(json.loads(container_stats.next()))

@app.route('/api/curated/<container_id>')
def curated_stats(container_id):
    stats = get_curated_stats(container_id)
    return jsonify(stats)

@app.route('/api/ps')
def ps():
    all_containers = get_all_containers()
    return jsonify({"data": all_containers})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
