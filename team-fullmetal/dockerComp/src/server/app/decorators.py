from functools import wraps

from flask import flash, redirect, url_for, request, session

def test(f):
  @wraps(f)
  def decorated_function(*args, **kwargs):
    if session['user'] is None:
      pass
    return f(*args, **kwargs)
  return decorated_function

def test2():
    try:
      return session['user']
    except:
      return False
