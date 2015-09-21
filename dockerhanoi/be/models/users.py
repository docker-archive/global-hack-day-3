# -*- coding: utf-8 -*-
"""
Created on 2015-09-16 18:09:00

@author: Tran Huu Cuong <tranhuucuong91@gmail.com>

"""

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy.types import Integer, String, DateTime

Base = declarative_base()


class Users(Base):
    """Mapping with table users"""

    __tablename__ = 'users'
    id = Column('id', Integer, primary_key=True)
    username = Column(String)
    password = Column(String)
    salt = Column(String)
    avatar = Column(String)
    firstname = Column(String)
    lastname = Column(String)
    created_at = Column('createdAt', DateTime)
    updated_at = Column('updatedAt', DateTime)

    def __repr__(self):
        return '<User {}>'.format(self.username)
