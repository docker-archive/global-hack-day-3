# -*- coding: utf-8 -*-
"""
Created on 2015-09-16 23:53:00

@author: Tran Huu Cuong <tranhuucuong91@gmail.com>

"""

import os

basedir = os.path.abspath(os.path.dirname(__file__))

DEV_MODE = True
DEBUG = False

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
# SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')

