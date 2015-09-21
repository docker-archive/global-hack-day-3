#!/usr/bin/python
# -*- coding: utf-8 -*-

DEBUG = False

import os
BASE_DIR = os.path.abspath(os.path.dirname(__file__))  

THREADS_PER_PAGE = 2

SECRET_KEY = ""

# Dictionary that holds all the template configuration
TEMPLATE_CONFIGURATION = {
    "title" : "dockerComp DDSC (Dockerized Distributed Scientific Computing)",
    "header_text" : "dockerComp",
}

HOST = "0.0.0.0"

PORT = 5000
