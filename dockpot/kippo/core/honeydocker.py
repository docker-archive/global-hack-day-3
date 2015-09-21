import docker
from kippo.core.config import config

server_uri=config().get('docker', 'uri')
docker_version=config().get('docker','version')
docker_name=config().get('docker','image_name')


def start_container():
    c = docker.Client(base_url=server_uri, version=docker_version)
    docker_id=str(c.create_container(image=docker_name)['Id'])
    c.start(docker_id,port_bindings={22:22})
    return docker_id



def stop_container(Id):
    c = docker.Client(base_url=server_uri, version=docker_version)
    c.stop(Id)
