# -*- coding: utf-8 -*-
"""
Created on 2015-09-16 18:09:00

@author: Tran Huu Cuong <tranhuucuong91@gmail.com>

"""

import logging
import sys
import signal
import subprocess

import shutil
import os
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models.apps import Apps
from models.tokens import Tokens
import config

logger = logging.getLogger('deploy_service')
logging.basicConfig(stream=sys.stderr, level=getattr(logging, 'INFO'))


def handler(signum=None, frame=None):
    logger.info('Signal handler called with signal {}'.format(signum))
    logger.info('Stop deploy_service')
    # check if process is done
    # time.sleep(1)
    # logger.info('Wait done')
    sys.exit()


def deploy_app(app_id):
    for sign in [signal.SIGTERM, signal.SIGINT, signal.SIGHUP, signal.SIGQUIT]:
        signal.signal(sign, handler)

    try:
        engine = create_engine(config.SQLALCHEMY_DATABASE_URI)
        Session = sessionmaker(bind=engine)
        session = Session()

        app = session.query(Apps).filter_by(id=app_id).first()
        token = session.query(Tokens).filter_by(user_id=app.user_id).first()

        path_deploy_tmp = '/tmp/app/{}'.format(app.id)
        shutil.rmtree(path_deploy_tmp, ignore_errors=True)
        os.makedirs(path_deploy_tmp, exist_ok=True)
        os.chdir(path_deploy_tmp)

        # clone git
        git_url_oauth = 'https://{}@{}'.format(token.token, app.git_url.replace('git://', ''))
        subprocess.call(['git', 'clone', git_url_oauth, '.'])

        # write Dockerfile, docker-compose.yml
        with open('Dockerfile', 'w') as f:
            f.write(app.docker_file)

        with open('docker-compose.yml', 'w') as f:
            f.write(app.docker_compose)

        # config deploy environment variables
        deploy_env = os.environ.copy()

        # env: docker machine
        if config.DEV_MODE:
            deploy_env['DOCKER_MACHINE_NAME'] = 'dm-single-host1'
        else:
            deploy_env['DOCKER_MACHINE_NAME'] = app.app_name.replace('/', '_')

        # env: docker images
        image_version = '0.1'
        docker_build_tag = '{}:{}'.format(app.app_name, image_version)
        docker_build_path = path_deploy_tmp

        deploy_env['DOCKER_BUILD_TAG'] = docker_build_tag
        deploy_env['DOCKER_BUILD_PATH'] = docker_build_path

        path_deploy_script = '{}/deploy_vm_docker.sh'.format(config.basedir)
        # run deploy script
        subprocess.call(['bash', path_deploy_script], env=deploy_env)

        logger.info('deploy app: {}'.format(app.app_name))
    except Exception as e:
        logger.error(e)
    finally:
        pass


def main():
    deploy_app(app_id=1)


if __name__ == '__main__':
    main()

    # app_id = int(sys.argv[1])
    # deploy_app(app_id=app_id)

