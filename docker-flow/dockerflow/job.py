"""Runner for workflow jobs
"""
# built-in
import os
import time

# 3rd party
import yaml


class JobContext(object):
    """Represents the context under which a job is executed
    """
    image = None
    volumes = {}
    working_dir = None
    build_dir = None

    def __init__(self, **kwargs):
        """Initialize defaults and customization of a context
        """
        for k, v in kwargs.iteritems():
            if hasattr(self, k):
                setattr(self, k, v)


class Job(object):
    image = None
    context = {}
    name = None
    description = None
    output = None
    checks = []
    pre_steps = []
    steps = []
    post_steps = []
    build_dir = None
    requires = []

    def __init__(self, **kwargs):
        """Represents a job
        """
        for k, v in kwargs.iteritems():
            if hasattr(self, k):
                setattr(self, k, v)
        if not self.name:
            self.name = "Job-{0}".format(time.time())
        self.ctx = JobContext(**self.context)
        self.build_dir = self.ctx.build_dir

    def dockerize(self):
        """Generate a Dockerfile based on the job properties
        """
        if not os.path.exists(self.build_dir):
            os.mkdir(self.build_dir)
        entrypoint_script = os.path.join(self.build_dir, 'entrypoint-{0}'.format(self.name))
        docker_file = os.path.join(self.build_dir, "Dockerfile-{0}".format(self.name))
        # add the steps to an entrypoint script
        with open(entrypoint_script, 'w') as f:
            f.write('\n'.join(self.steps))
        print 'Generated entrypoint script {0}'.format(entrypoint_script)
        l_entrypoint = os.path.basename(entrypoint_script)
        with open(docker_file, 'w') as f:
            f.write("FROM {0}\n".format(self.image))
            f.write("ADD {0} /usr/local/bin/entrypoint.sh\n".format(l_entrypoint))
            f.write("RUN chmod 755 /usr/local/bin/entrypoint.sh\n")
            f.write("ENTRYPOINT /usr/local/bin/entrypoint.sh\n")
        print 'Created Dockerfile {0}'.format(docker_file)
        return docker_file

    def compose(self):
        """Generate a docker-compose file based on the job properties
        celery-builder:
              build: .
                dockerfile: Dockerfile-celery-sdist
                  volumes:
                         - /Users/cindy.cao/workspace:/workspace
                            - /Users/cindy.cao/builds:/builds
                              working_dir: /workspace
        """
        compose_file = os.path.join(self.build_dir, "docker-compose-{0}.yml".format(self.name))
        compose_conf = {"build": self.build_dir,
                        "dockerfile": os.path.basename(self.dockerize()),
                        "working_dir": self.ctx.working_dir
                       }
        if self.ctx.volumes:
            volumes = []
            for local_dir, mnt_point in self.ctx.volumes.iteritems(): 
                volumes.append("{0}:{1}".format(local_dir, mnt_point))
            compose_conf["volumes"] = volumes
        compose = {self.name: compose_conf}

        with open(compose_file, 'w') as f:
            yaml.dump(compose, f, indent=4, default_flow_style=False)
        return compose_file
