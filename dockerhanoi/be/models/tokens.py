# -*- coding: utf-8 -*-
"""
Created on 2015-09-16 18:09:00

@author: Tran Huu Cuong <tranhuucuong91@gmail.com>

"""

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Integer, String, DateTime

Base = declarative_base()


class Tokens(Base):
    """Mapping with table users"""

    __tablename__ = 'tokens'
    id = Column('id', Integer, primary_key=True)
    token = Column(String)
    expired_at = Column('expiredAt', DateTime)
    created_at = Column('createdAt', DateTime)
    updated_at = Column('updatedAt', DateTime)
    user_id = Column('UserId', String, ForeignKey('users.id'))

    def __repr__(self):
        return '<Token {}>'.format(self.username)
