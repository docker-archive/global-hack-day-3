# vim: set fileencoding=utf-8
# Pavel Odvody <podvody@redhat.com>
#
# HICA - Host integrated container applications
#
# MIT License (C) 2015

import os, sys

class HicaValueType(object):
  (PATH, INT, GLOB, STRING) = [0] + [1 << x for x in range(3)]

class HicaInjector(object):
  def get_config_key(self):
    return None

  def get_injected_args(self):
    return None

  def inject_config(self, config):
    pass

class HicaConfiguration(object):
  def __init__(self):
    pass

class HicaDriverBase(object):
  def __init__(self):
    pass

  def launch_container(self, config):
    pass



def main():
  pass

if __name__ == "main":
  main()
