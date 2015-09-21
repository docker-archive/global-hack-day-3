#!/usr/bin/env python

try:
    import pkg_resources
    import setuptools
except ImportError:
    # Import setuptools if it's not already installed
    import distribute_setup
    distribute_setup.use_setuptools()

import os
import sys
from setuptools import setup
from setuptools import find_packages

opt_requires = []
# argparse is built-in in py2.7+ and py3.2+
if (sys.version_info[:2][0] < 3 and sys.version_info[:2][1] < 7) or (sys.version_info[:2][0] >= 3 and sys.version_info[:2][1] < 2):
    opt_requires.append('argparse')

setup(
        name = "traductor",
        version = "0.0.1",
        author = "Chris Fordham, Shaun Smekel, Toby Harris",
        author_email = "foo@bar.suf",
        description = "docker compose to system service file",
        url = "https://github.com/the0rem/traductor",
        entry_points = {
            'console_scripts': [
                'traductor = traductor.traductor:Cli',
            ]
        },
        packages = find_packages(exclude=["*.tests", "*.tests.*", "tests.*", "tests"]),
        package_data = {'': ['templates/*.service', 'examples/*.yaml']},
        include_package_data = True,
        install_requires = ['PyYAML', 'Jinja2', 'six'] + opt_requires,
        test_suite = 'tests',
        # tests_require = [],
        )
