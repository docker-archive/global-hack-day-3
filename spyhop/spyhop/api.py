#!/usr/bin/env python
from docker import Client
from flask import jsonify
import json


def calculate_cpu_percent(stats1, stats2):
    cpu1 = stats1['cpu_stats']['cpu_usage']['total_usage']
    system1 = stats1['cpu_stats']['system_cpu_usage']
    cpu2 = stats2['cpu_stats']['cpu_usage']['total_usage']
    system2 = stats2['cpu_stats']['system_cpu_usage']
    # Calculate deltas
    cpu_delta = float(cpu2 - cpu1)
    system_delta = float(system2 - system1)
    # Calculate percent
    if (system_delta > 0.0 and cpu_delta > 0.0):
        cpu_percent = (cpu_delta / system_delta) * len(stats2['cpu_stats']['cpu_usage']['percpu_usage']) * 100.0
    else:
        cpu_percent = 0.0

    if cpu_percent < 150:
        return cpu_percent
    else:
        return 0.0

def calculate_memory_percent(stats):
    memory_percent = (float(stats['memory_stats']['usage']) / float(stats['memory_stats']['limit'])) * 100
    print(memory_percent)
    return memory_percent

def calculate_network(stats1, stats2):
    rx1 = stats1['network']['rx_bytes']
    rx2 = stats2['network']['rx_bytes']
    tx1 = stats1['network']['tx_bytes']
    tx2 = stats2['network']['tx_bytes']
    data_in = rx2 - rx1
    data_out = tx2 - tx1
    return data_in, data_out

def get_container_stats(container_id):
    cli = Client(base_url='unix://var/run/docker.sock')
    try:
        stats = cli.stats(container_id)
        return stats
    except Exception, error:
        return error

def get_curated_stats(container_id):
    # Get generator and two stats packets
    stats_generator = get_container_stats(container_id)
    stats1 = json.loads(stats_generator.next())
    stats2 = json.loads(stats_generator.next())
    # Calculate curated stats
    cpu_percent = calculate_cpu_percent(stats1, stats2)
    mem_percent = calculate_memory_percent(stats2)
    bytes_in, bytes_out = calculate_network(stats1, stats2)
    # Put stats into JSON
    monitoring_stats = {
        "cpu_percent": cpu_percent,
        "mem_percent": mem_percent,
        "bytes_in": bytes_in,
        "bytes_out": bytes_out
    }
    return monitoring_stats

def get_all_containers():
    cli = Client(base_url='unix://var/run/docker.sock')
    containers = cli.containers()
    return containers


def main():
    pass

if __name__ == '__main__':
    main()

