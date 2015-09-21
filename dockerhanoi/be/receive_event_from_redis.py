# -*- coding: utf-8 -*-
"""
Created on 2015-09-15 20:22:00

@author: Tran Huu Cuong <tranhuucuong91@gmail.com>

"""

from redis import Redis


# redis = Redis(host='redis', port=6379)
redis = Redis(host='127.0.0.1', port=6379)


redis.incr('hits')
print('Hello World! I have been seen {} times.'.format(redis.get('hits').decode('utf-8')))


