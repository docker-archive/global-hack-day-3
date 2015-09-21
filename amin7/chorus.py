#!/usr/bin/python

"""
A CLI tool to distribute dockerfiles to a group of machines running docker, have them built and run
"""

__author__ = 'nbyrne'

# chorus CLI

import logging
import os
import shlex
import subprocess
import sys
import urllib2


# FILE LOCATION CONSTANTS
HOME = os.path.join(os.getenv("HOME"), ".chorus")
CACHEFILE = os.path.join(HOME, "cache")
SUBNET = os.path.join(HOME, "subnet")
LOGFILE = os.path.join(HOME, "chorus.log")
PORT = 9009

# BEHAVIOR CONTEXT CONSTANTS
RETRIES = 3
DEBUG = False
TIMEOUT = 5


class Arguments(object):
    """
    A class containing methods to manage command line arguments.
    """
    def __init__(self):
        self.args = sys.argv
        self.args_string = ",".join(sys.argv)
        logging.info("chorus was called with arguments %s" % self.args_string)
        self._parse()

    def _parse(self):
        """
        Parses the command line arguments supplied to the application.
        Writes help to stdout as needed, and exits on bad syntax with an errorcode of 1.
        :return: None
        """
        if len(self.args) == 2:
            if self.args[1] == "help":
                print "Valid Commands:"
                print "\tchorus hosts -- retrieve a list of all hosts, and their current status"
                print "\tchorus busy -- retrieve a list of all servers on this subnet running/building containers."
                print "\tchorus lazy -- retrieve a list of all idle servers on this subnet."
                print "\tchorus stop [ip address] -- halts any running/building containers on this machine."
                print ("\tchorus schedule [dockerfile] [#] -- schedule this dockerfile on the first "
                       "free machine.")
                print "\tchorus ping [ip address] -- confirms chorus webservice is running correctly on a machine."
                print "\tchorus ping fleet -- confirms chorus webservice is running correctly on all machines."
                print ""
                sys.exit(0)
            if self.args[1] == "busy" or self.args[1] == "lazy" or self.args[1] == "hosts":
                return
        if len(self.args) > 1:
            if self.args[1] == "stop" and len(self.args) == 3:
                return
            if (self.args[1] == "ping") and len(self.args) == 3:
                return
            if (self.args[1] == "schedule") and len(self.args) == 4:
                return
        print "Try: chorus help\n"
        sys.exit(1)


class Command(object):
    """
    A class containing methods to manage webservice interactions.
    (Has a dependency on the function 'webservice'.)
    """

    @staticmethod
    def check(ip):
        """
        Communicates with the webservice on the host with the specfied ip to check the webservice is up.
        :param ip: The ip address of the host to check.
        :return: A boolean indicating whether the host is healthy or not.
        """
        data = webservice("http://%s:%d/healthy" % (ip, PORT))
        if data[1] == "TRUE":
            return True
        else:
            return False

    @staticmethod
    def details(ip):
        """
        Communicates with the webservice on the host with the specfied ip to determine what the host is doing.
        :param ip: The ip address of the host to check.
        :return: A msg relayed from the webservice.
        """
        data = webservice("http://%s:%d/details" % (ip, PORT))
        if data[0] is True:
            return data[1]
        else:
            return "Unknown"

    @staticmethod
    def failed(ip):
        """
        Aggregates webservice calls together to determine if the last CID on this host was successful.
        :param ip: The ip address of the host to check.
        :return: A boolean indicating if the last CID run on this machine was successful.
        """
        success = Command.successful_containers(ip)
        last = Command.lastcontainer(ip)
        if last in success:
            return False
        return True

    @staticmethod
    def hosts():
        """
        Aggregates webservice calls together to poll information about the hosts in this cluster.
        :return: None
        """
        result = []
        not_responding = []
        busy_hosts = Command.status("busy")
        lazy_hosts = Command.status("lazy")
        targets = cache_file()
        for ip in targets:
            if not Command.check(ip):
                not_responding.append("%s\tIS NOT RESPONDING!" % ip)
                continue
            if ip in busy_hosts:
                container = Command.lastcontainer(ip)
                if len(container.strip()) == 0:
                    container = "Unknown CID"
                df = Command.lastdf(ip)
                details = Command.details(ip)
                seconds = Command.runtime(ip)
                if details == "Building":
                    container = "-----"
                result.append("%s\tCID: %s\tUP: %s\t%s: %s" % (ip, container[0:5], seconds, details, df))
                continue
            if ip not in busy_hosts and ip not in lazy_hosts:
                result.append("%s\tMalfunctioning host." % ip)
            else:
                result.append("%s\tCurrently idle." % ip)
        sorted(result)
        return result + not_responding

    @staticmethod
    def lastcontainer(ip):
        """
        Communicates with the webservice on the host with the specified ip to read the last CID.
        :param ip: The ip address of the host to check.
        :return: A string containing the content of the webservice response.
        """
        logging.info("Looking up the last CID on host: %s" % ip)
        data = webservice("http://%s:%d/lastcontainer" % (ip, PORT))
        if data[1].strip() == "":
            data[1] = "CID FILE NOT FOUND!"
        return data[1]

    @staticmethod
    def lastdf(ip):
        """
        Communicates with the webservice on the host with the specified ip to read the last dockerfile filename run.
        :param ip: The ip address of the host to check.
        :return: A string containing the content of the webservice response.
        """
        logging.info("Looking up the last INI file scheduled on host: %s" % ip)
        data = webservice("http://%s:%d/lastdf" % (ip, PORT))
        if data[1].strip() == "":
            data[1] = "Unknown!"
        return data[1]

    @staticmethod
    def runtime(ip):
        """
        Communicates with the webservice on the host with the specified ip to determine the container uptime.
        :param ip: The ip address of the host to check.
        :return: A string containing the content of the webservice response, formatted for hourly measurement.
        """
        logging.info("Looking up the current container uptime on host: %s" % ip)
        data = webservice("http://%s:%d/runtime" % (ip, PORT))
        if data[1].strip() == "" or data[1].strip() == "UNKNOWN":
            data[1] = "Unknown!"
        else:
            data[1] = float(data[1])/3600.0
            data[1] = "%.2f" % data[1]
        return data[1]

    @staticmethod
    def schedule(dockerfile, count):
        """
        Uses the webservice to find available hosts to schedule on, copies the build file to the remote machine,
        builds it, and runs it
        :param dockerfile The path to the local dockerfile to install on the chorused fleet.
        :param count The number of machines to start with this dockerfile.
        :return: None
        """
        logging.info("Attempting to schedule %d instance(s) of the docker file: %s" % (count, dockerfile))
        # Find lazy machines we can use to schedule to
        data = Command.status("lazy")
        if len(data) == 0:
            print "There are no available machines."
            sys.exit(1)
        if len(data) < count:
            print ("You requested %d instances of this dockerfile, but you have only %d machines free right now." %
                   (count, len(data)))

        dockerfile_stack = []
        for i in range(0, count):
            dockerfile_stack.append(dockerfile)

        for ip in data:
            # Do not schedule to nodes not running the webservice
            if not Command.check(ip):
                print "The webservice is not responding on the machine at: %s" % ip
                continue
            if len(dockerfile_stack) == 0:
                break
            if Command.failed(ip):
                print "ERROR: scheduling dockerfile on %s" % (ip)
                lastdf = Command.lastdf(ip)
                lastcid = Command.lastcontainer(ip)
                print "%s: previous failure running %s, with CID of %s" % (ip, lastdf, lastcid[0:5])
                print "%s: running new container ..." % ip

            # Send the dockerfile to the remote machine with POST and run the built container
            dockerfile_stack.pop()
            dockerfile_data = os.path.basename(dockerfile).replace(' ', '_') + "\n"
            with open(dockerfile, 'r') as f:
                dockerfile_data += f.read()
            data = webservice("http://%s:%d/build" % (ip, PORT), postdata=dockerfile_data)
            if data[0] is True:
                print "%s: OK (%s)" % (ip, dockerfile)
            else:
                print "%s: FAIL" % ip

    @staticmethod
    def status(cmd):
        """
        Communicates with the webservice to processes the 'busy' and 'lazy' commands.
        :param cmd: The keyword that was issued 'busy' or 'lazy'.
        :return: A list of ip's representing hosts in the state described by the 'cmd' parameter.
        """
        logging.info("The CLI received a request to identify hosts in the '%s' state." % cmd)
        result = []
        not_responding = []
        targets = cache_file()
        for ip in targets:
            if not Command.check(ip):
                logging.warn("HOST: %s is not responding to health checks." % ip)
                not_responding.append("%s\tIS NOT RESPONDING!" % ip)
            else:
                data = webservice("http://%s:9009/busy" % ip)[1]
                if data == "TRUE" and cmd == "busy":
                    result.append(ip)
                if data == "FALSE" and cmd == "lazy":
                    result.append(ip)
        sorted(result)
        sorted(not_responding)
        return result + not_responding

    @staticmethod
    def successful_containers(ip):
        """
        Communicates with the webservice on the host with the specified ip to read the list of successful CID's.
        :param ip: The ip address of the host to check.
        :return: A list of strings for each successful CID that were run by docker.
        """
        logging.info("Looking up the successfully run CID's on host: %s" % ip)
        data = webservice("http://%s:9009/success" % ip)
        if data[1].strip() == "":
            data[1] = "CID FILE NOT FOUND!"
        return data[1].split('\n')

    @staticmethod
    def stop(ip):
        """
        Communicates with the webservice on the host with the specified ip to halt any running or building CID's.
        :param ip: The ip address of the host to halt.
        :return: A msg from the webservice as a string.
        """
        logging.info("Halting builds and running containers on host: %s" % ip)
        data = webservice("http://%s:9009/stop" % ip)
        return data[1]


def cache_file():
    """
    Reads the chorus cachefile and returns it's contents as a list.
    :return: A list of ip's, read from the chorus cache file.
    """
    if not os.path.exists(CACHEFILE):
            print "No cache file found.\n"
            sys.exit(1)
    with open(CACHEFILE) as f:
        hosts = f.read().strip().split("\n")
    return hosts


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


def webservice(url, retries=RETRIES, postdata=False):
    """
    A wrapper around urllib.urlopen to allow for retries
    :param url: The url to fetch content from.
    :param retries: The number of times to retry the urlopen method.
    :return: A dictionary with a boolean at success, and
    """
    attempt = 0
    data = [False, '']
    while attempt < retries:
        try:
            if postdata is False:
                logging.info("urlopen: GET %s" % url)
                data[1] = urllib2.urlopen(url, timeout=TIMEOUT).read().strip()
                data[0] = True
            else:
                logging.info("urlopen: POST %s" % url)
                data[1] = urllib2.urlopen(url, postdata, timeout=TIMEOUT).read().strip()
                data[0] = True
            logging.info("urlopen: RESP received %s" % data[1].replace('\n', r'\n'))
            break
        except urllib2.HTTPError, e:
            # Handle specific error types
            code = e.getcode()
            logging.error("Received HTTP response code: %d - %s" % (code, data[1]))
        except BaseException as e:
            logging.error(e.message)
        attempt += 1
    return data


def main():
    
    # Handle the busy, and lazy commands - use cached data to find nodes
    if sys.argv[1] == "busy" or sys.argv[1] == "lazy":
        print "\n".join(Command.status(sys.argv[1]))

    # Handle the hosts command
    if sys.argv[1] == "hosts":
        print "\n".join(Command.hosts())

    # Handle the stop command
    if sys.argv[1] == "stop":
        print Command.stop(sys.argv[2])

    # Check the webservice on a particular machine
    if sys.argv[1] == "ping":
        if sys.argv[2] == "fleet":
            iplist = cache_file()
        else:
            iplist = [sys.argv[2]]
        for ip in iplist:
            if Command.check(ip):
                print "%s - OK" % ip
            else:
                print "%s - FAILURE" % ip

    # Integrate with the scheduler to launch an ini file
    if sys.argv[1] == "schedule":
        dockerfile = sys.argv[2]
        number = int(sys.argv[3])
        Command.schedule(dockerfile, number)

    sys.exit(0)

if __name__ == '__main__':
    if not os.path.exists(HOME):
        print "You must create a %s folder." % HOME
        sys.exit(1)
    setup_logging(LOGFILE)
    arg = Arguments()
    main()
