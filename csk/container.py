"""
Copyright (c) 2015 David Becvarik
All rights reserved.

This software may be modified and distributed under the terms
of the BSD license. See the LICENSE file for details.
"""
from __future__ import print_function
import logging
from docker import Client
import os
import re
import base64
import requests
d = Client()

logger = logging.getLogger('csk')


class Container(object):
    name = None
    container = None
    ip_address = None
    running = False
    tools = None

    def __init__(self, name):
        for candidate in d.containers():
            if candidate["Id"].startswith(name):
                logger.debug("found container %s" %candidate["Id"])
                self.container = candidate
        self.name = name

    def __enter__(self):
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

    def _put_file(self,content):
        # FIXME - this is very very ugly hack - it uses docker remote API directly

        headers = {
            'Content-Type': 'application/tar',
        }

        params = {
            #maybe choose some better path
            'path' : '/tmp/tools/',
            'noOverwriteDirNonDir' : 'true'
            }
    
        res = d.put(
            d._url("/containers/{0}/archive".format(self.container['Id'])),
            data=content,
            params=params,
            headers = headers
        )
        d._raise_for_status(res)

    def enable_csk(self):
        fuse_bin = "%s/fuse9fs.zip" %os.path.dirname(__file__)
        self._put_file(fuse_bin)

    def remove_csk(self):
        self.execute("rm -rf /tmp/tools")

    def enable_csk_by_copy(self, tools):
        self.tools = tools.container["Id"]
        self.execute("mkdir -p /tmp/tools")
        content = d.copy(self.tools, "/")
        self._put_file(content.data)
        print("please run:\n  docker exec -ti %s /tmp/tools/%s/bin/bash" %(self.container["Id"], self.tools))
        print("  export PATH=$PATH:/tmp/tools/%s/bin:/tmp/tools/%s/usr/bin" % (self.tools, self.tools))
                
    def execute(self, cmd):
        """ executes cmd in container and return its output """
        inst = d.exec_create(container=self.container, cmd=cmd)

        output = d.exec_start(inst)
        retcode = d.exec_inspect(inst)['ExitCode']

        if retcode is not 0:
            raise Exception("Command %s failed to execute, return code: %s" % (cmd, retcode), output)

        return output

    def start(self, **kwargs):
        """ Starts a detached container for selected image """
        if self.running:
            logger.debug("Container is running")
            return
        logger.debug("Creating container from image '%s'..." % self.name)
        self.container = d.create_container(image=self.name, detach=True, **kwargs)
        logger.debug("Starting container '%s'..." % self.container.get('Id'))
        d.start(container=self.container)
        self.running = True
        self.ip_address =  d.inspect_container(container=self.container.get('Id'))['NetworkSettings']['IPAddress']

    def stop(self, save_output=False):
        """
        Stops (and removes) selected container.
        Additionally saves the STDOUT output to a `container_output` file for later investigation.
        """
        if self.running and save_output:
            if not self.name:
                self.name = self.container.get('Id')
            filename = "".join([c for c in self.name if re.match(r'[\w\ ]', c)])
            out_path = self.output_dir + "/output-" + filename + ".txt"
            if not os.path.exists(self.output_dir):
                os.makedirs(self.output_dir)
            with open(out_path, 'w') as f:
                print(d.attach(container=self.container.get('Id'), stream=False, logs=True), file=f)
            f.closed
        if self.container:
            logger.debug("Removing container '%s'" % self.container['Id'])
            d.kill(container=self.container)
            self.running = False
            d.remove_container(self.container)

    def pull(self, image):
        logger.info("pulling image %s" %self.name)
        for line in cli.pull('image', stream=True):
            loger.debug("  %s")

    def session(self, cmd="bash"):
        pass

    def _proper_session(self, cmd="bash"):
  
        cmd = shlex.split(str(cmd))

        data = {
            'Container': self.container['Id'],
        #    'User': user,
        #    'Privileged': privileged,
            'Tty': True,
            'AttachStdin': True,
            'AttachStdout': True,
            'AttachStderr': True,
            'Cmd': cmd
        }

        url = d._url('/containers/{0}/exec', self.container['Id'])
        res = d._post_json(url, data=data)
        
        
        
       
