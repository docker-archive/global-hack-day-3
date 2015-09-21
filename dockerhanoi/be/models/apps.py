# -*- coding: utf-8 -*-
"""
Created on 2015-09-16 18:09:00

@author: Tran Huu Cuong <tranhuucuong91@gmail.com>

"""

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy.types import Integer, String, DateTime
from sqlalchemy import ForeignKey

Base = declarative_base()


class Apps(Base):
    """Mapping with table apps"""

    __tablename__ = 'apps'
    id = Column('id', Integer, primary_key=True)
    app_name = Column('appName', String)
    deploy_url = Column('deployUrl', String)
    aws_access_key_id = Column('awsAccessKeyId', String)
    aws_secret_access_key = Column('awsSecretAccessKey', String)
    aws_vpc_id = Column('awsVpcId', String)
    html_url = Column('htmlUrl', String)
    git_url = Column('gitUrl', String)
    git_branch = Column('gitBranch', String)
    docker_file = Column('dockerFile', String)
    docker_compose = Column('dockerCompose', String)
    created_at = Column('createdAt', DateTime)
    updated_at = Column('updatedAt', DateTime)
    user_id = Column('UserId', String, ForeignKey('users.id'))

    def __repr__(self):
        return '<App {}>'.format(self.app_name)
