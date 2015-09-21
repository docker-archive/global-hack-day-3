#!/usr/bin/python

"""
The chorus webservice responsible for communicating with the CLI.
Allows you to distribute docker files for building and deploying containers inside a cloud environment.
"""

__author__ = 'nbyrne'

# Webservice allowing management of a fleet of machines running the docker service

import BaseHTTPServer
import logging
import os
import re
import shlex
import subprocess
import threading
import time
import urlparse

# CONSTANTS
DEBUG = True
PORT_NUMBER = 9009
HOST_NAME = '0.0.0.0'
LOGFILE = 'webservice.log'
RUNDIR = '/tmp'


def route(path, req):
    """
    Provide a mechanism for calling the appropriate HttpRoute method based on path.
    :param path: The path being requested in the request object.
    :param req: The request object itself.
    :return: None
    """
    path = path.replace('/', '')
    if path in HttpRouter.__dict__ and path != 'headers' and path != 'threaded_build_and_run':
        HttpRouter.__dict__[path].__func__(req)
    else:
        req.send_response(404)
        req.send_header("Content-type", "text/plain")
        req.wfile.write("NOT FOUND")
        logging.error("BAD REQUEST TO PATH: %s" % path)
        return


def run_command(cmd):
    """
    Executes a system call safely, and returns output and errorcode.
    :param cmd: A string containing the command to run.
    :return:
        A string containing stdout,
        A string containing stderr,
        An integer errorcode
    """
    logging.info("System call: %s" % cmd)
    p = subprocess.Popen(shlex.split(cmd), stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE)
    out, err = p.communicate()
    errcode = p.returncode
    logging.info("Return code: %s" % errcode)
    if errcode:
        logging.error(err)
    return out, err, errcode


def setup_logging(filename, level=logging.INFO):
    """
    Sets up the logging interface.
    :param filename: A string containing the filename to log to.
    :param level:  The minimum log level to log with.
    :return: None
    """
    log = logging.getLogger()
    log.setLevel(level)
    log_formatter = logging.Formatter("%(asctime)s [ %(threadName)-12.12s] [ %(levelname)-5.5s]  %(message)s")
    handler1 = logging.FileHandler(filename)
    handler2 = logging.StreamHandler()
    handler2.setFormatter(log_formatter)
    log.addHandler(handler1)
    if DEBUG:
        # DEBUG mode will log all messages to the console in parallel
        log.addHandler(handler2)
    return None


class MyHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    """ Handler for the listener. """

    def do_HEAD(req):
        """Attach headers to a response."""
        req.send_response(200)
        req.send_header("Content-type", "text/html")
        req.end_headers()

    def do_GET(req):
        """Respond to a GET request."""
        path = urlparse.urlparse(req.path).path
        logging.info("Webservice GET request: %s" % path)
        route(path, req)

    def do_POST(req):
        """Respond to a POST request."""
        path = urlparse.urlparse(req.path).path
        logging.info("Webservice POST request: %s" % path)
        route(path, req)


class HttpRouter(object):
    """
    A class containing methods for handling http requests by request path.
    """
    BUILDLOCK = False
    RUNLOCK = False
    BUILDFAILED = False
    BUILDRESULTS = {}
    THREAD = None

    @staticmethod
    def threaded_build_and_run(filename, filedata):
        """
        A wrapper around run_command to allow threading.
        :param filename: The dockerfile that was sent to the webservice
        :return: None, stores results in HttpRouter.BUILDRESULTS
        """
        HttpRouter.BUILDLOCK = True
        logging.warn("Build thread launched.")
        fname = os.path.join(RUNDIR, "start.time")
        with open(fname, "w") as f:
            f.write(str(time.time()))
            f.write('\n')
        fname = os.path.join(RUNDIR, "dockerfile")
        with open(fname, "w") as f:
            f.write(filename)
            f.write('\n')
        cmd = "docker build -t local/%s docker-staging" % filename
        out, err, code = run_command(cmd)
        if code:
            logging.error("Build thread failed!")
            HttpRouter.BUILDLOCK = False
            HttpRouter.BUILDFAILED = True
            return
        # Parse chorus metadata
        docker_args = []
        for line in filedata.split('\n'):
            match = re.match(r'^# chorus (.+)$', line, re.DOTALL)
            if match is not None:
                docker_args.append(match.group(1))
        cidfile = os.path.join(RUNDIR, 'lastrun.cid')
        # Remove any exists cid files
        try:
            os.remove(cidfile)
        except OSError:
            pass
        cmd = "docker run --cidfile=\"%s\" " % cidfile
        for arg in docker_args:
            cmd = cmd + arg.strip() + " "
        cmd = cmd + "local/" + filename
        HttpRouter.RUNLOCK = True
        HttpRouter.BUILDLOCK = False
        logging.warn("Launching container.")
        fname = os.path.join(RUNDIR, "start.time")
        with open(fname, "w") as f:
            f.write(str(time.time()))
            f.write('\n')
        out, err, code = run_command(cmd)
        if code:
            logging.error("Container exited with non-zero status!")
            HttpRouter.RUNLOCK = False
            return
        HttpRouter.RUNLOCK = False
        return

    @staticmethod
    def stop(req):
        HttpRouter.headers(req)
        if HttpRouter.RUNLOCK:
            fname = os.path.join(RUNDIR, "lastrun.cid")
            data = ""
            if os.path.exists(fname):
                with open(fname) as f:
                    data = f.read()
            cmd = "docker stop %s" % data
            out, err, code = run_command(cmd)
            if code:
                req.wfile.write("FAILURE!\n")
            else:
                req.wfile.write("OK\n")
        else:
            req.wfile.write("NO RUNNING CONTAINERS.\n")

    @staticmethod
    def headers(req):
        req.send_response(200)
        req.send_header("Content-type", "text/plain")
        req.end_headers()
        return

    @staticmethod
    def build(req):
        if HttpRouter.BUILDLOCK:
            req.send_response(503)
            req.send_header("Content-type", "text/plain")
            req.end_headers()
            req.wfile.write("BUILD ALREADY IN PROGRESS")
            return
        content_len = int(req.headers.getheader('content-length', 0))
        filedata = req.rfile.read(content_len)
        filedata = filedata.split('\n')
        filename = filedata[0].strip()
        filedata = '\n'.join(filedata[1:])
        try:
            os.mkdir("docker-staging")
        except OSError:
            pass
        except not OSError:
            logging.error("Unable to create docker staging folder.")
            pass
        with open('docker-staging/dockerfile', 'w') as f:
            f.write(filedata)
        HttpRouter.headers(req)
        logging.info("Received dockerfile contents named: %s." % filename)
        logging.warn("Beginning docker build cycle ... ")
        # Launch Build, and inform client what is happening
        req.wfile.write("BUILD LAUNCHED\n")
        HttpRouter.THREAD = threading.Thread(target=HttpRouter.threaded_build_and_run, args=[filename, filedata])
        HttpRouter.THREAD.start()
        return

    @staticmethod
    def success(req):
        fname = os.path.join(RUNDIR, "success.cid")
        data = ""
        if os.path.exists(fname):
            with open(fname) as f:
                data = f.read()
        HttpRouter.headers(req)
        req.wfile.write(data+"\n")
        return

    @staticmethod
    def healthy(req):
        HttpRouter.headers(req)
        req.wfile.write("TRUE\n")
        return

    @staticmethod
    def lastcontainer(req):
        fname = os.path.join(RUNDIR, "lastrun.cid")
        data = ""
        if os.path.exists(fname):
            with open(fname) as f:
                data = f.read()
        HttpRouter.headers(req)
        req.wfile.write(data+"\n")
        return

    @staticmethod
    def lastdf(req):
        fname = os.path.join(RUNDIR, "dockerfile")
        data = ""
        if os.path.exists(fname):
            with open(fname) as f:
                data = f.read()
        HttpRouter.headers(req)
        req.wfile.write(data+"\n")
        return

    @staticmethod
    def containers(req):
        HttpRouter.headers(req)
        cmd = "docker ps --no-trunc"
        out, err, code = run_command(cmd)
        data = out.split('\n')
        for line in data:
            match = re.search(r"^([a-z|0-9]+)\s+", line.strip())
            if match is not None:
                req.wfile.write("%s\n" % match.group(1))
        if code != 0:
            logging.error("ERROR RUNNING: %s" % cmd)
            logging.error("ERROR: %s" % err)
        return

    @staticmethod
    def busy(req):
        HttpRouter.headers(req)
        cmd = "docker ps"
        out, err, code = run_command(cmd)
        data = out.strip().split("\n")
        # Catch docker containers downloading images
        cmd = "ps aux"
        out, err, code = run_command(cmd)
        data2 = out.strip()
        if len(data) < 2 and data2.count("docker run") == 0:
            req.wfile.write("FALSE\n")
        else:
            req.wfile.write("TRUE\n")
        return

    @staticmethod
    def runtime(req):
        HttpRouter.headers(req)
        fname = os.path.join(RUNDIR, "start.time")
        if not os.path.exists(fname):
            req.wfile.write("UNKNOWN\n")
        else:
            with open(fname) as f:
                runtime = float(f.read().strip())
                runtime = round(time.time() - runtime)
            req.wfile.write("%d\n" % runtime)
        return

    @staticmethod
    def details(req):
        HttpRouter.headers(req)
        msg = 'Idle'
        if HttpRouter.BUILDLOCK:
            msg = 'Building'
        if HttpRouter.RUNLOCK:
            msg = 'Running'
        req.wfile.write("%s\n" % msg)
        return


def main():
    print time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER)
    logging.info("Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER)
    logging.info("Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER))


if __name__ == '__main__':
    RUNDIR = os.path.join(RUNDIR, ".chorus")
    try:
        os.mkdir(RUNDIR)
    except OSError:
        pass
    os.chdir(RUNDIR)
    setup_logging(LOGFILE)
    server_class = BaseHTTPServer.HTTPServer
    httpd = server_class((HOST_NAME, PORT_NUMBER), MyHandler)
    main()
