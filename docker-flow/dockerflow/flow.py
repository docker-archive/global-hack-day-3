# built-in
import os
import time

# 3rd party
import yaml
from compose.container import Container
from compose.cli.command import Command as ComposeCommand

# custom
from dockerflow.job import Job, JobContext


class FlowConfigError(Exception): 
    pass


class FlowRuntimeError(Exception): 
    pass


class Flow(object): 
    """Represents a workflow
    """
    name = None
    description = None
    volumes = {}
    build_dir = None
    _jobs = {}
    _queue = []
    _composed = []
    _ctx = None

    DOCKER_FLOW_BUILD_DIR = '~/.docker-flow'

    def __init__(self, **kwargs): 
        for k, v in kwargs.iteritems(): 
            if hasattr(self, k): 
                setattr(self, k, v)
        if not self.name:
            raise FlowConfigError("Name of the workflow must be specified")
        vols = kwargs.get("volumes", [])
        self.volumes = dict(map(lambda a: a.split(':'), vols))
        if 'context' in kwargs and 'build_dir' in kwargs['context']: 
            self.build_dir = kwargs['context']['build_dir']
        else: 
            self.build_dir = self.DOCKER_FLOW_BUILD_DIR
        self._ctx = {"volumes": self.volumes, 
                     "build_dir": self.build_dir
                    }
        job_configs = kwargs.get("jobs", [])
        for _config in job_configs:
            for job_name, job_config in _config.iteritems():
                job_config["context"] = self._ctx
                job = Job(**job_config)
                job.name = job_name
                self._jobs[job.name] = job

    @classmethod
    def from_yaml(cls, yaml_file, context): 
        """Create a Flow from a yaml config file
        """
        if not os.path.exists(yaml_file): 
            raise FlowConfigError("Workflow file {0} is not found".format(yaml_file))
        with open(yaml_file, 'r') as f: 
            data = yaml.load(f)
        data['context'] = context
        flow = Flow(**data)
        return flow

    def run(self): 
        """Run jobs
        """
        composed = self.compose_jobs()
        for job_name, compose_path in composed.iteritems():
            print "Running job {0} with compose {1}".format(job_name, compose_path)
            compose_cmd = ComposeCommand()
            project = compose_cmd.get_project(compose_path)
            print 'Building project {0}'.format(project.name)
            project.build()
            print 'Running compose project {0}'.format(project.name)
            project.up()
            print 'Project is_running status is {0}'.format(project.containers()[0].is_running)
        return project

    def compose_jobs(self): 
        """Compose jobs
        """
        composed = {}
        for job_name, job in self._jobs.iteritems(): 
            compose = job.compose()
            composed[job.name] = compose
        return composed
