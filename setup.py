#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import re
import sys

from setuptools import find_packages
from setuptools import setup


install_requires = [
    'argparse == 1.1',
    'PyYAML >= 3.10, < 4',
    'docker-compose >=1.4.1',
]


setup(
    name='docker-flow',
    version="1.0",
    description='Workflow management with Docker Compose and Swarm',
    url='https://www.dockerflow.net',
    author='Cindy Cao',
    license='Apache License 2.0',
    packages=find_packages(exclude=['tests.*', 'tests']),
    include_package_data=True,
    test_suite='nose.collector',
    install_requires=install_requires,
    entry_points="""
    [console_scripts]
    docker-flow=dockerflow.cli.main:main
    """,
)
