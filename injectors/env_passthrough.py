# vim: set fileencoding=utf-8
# Pavel Odvody <podvody@redhat.com>
#
# HICA - Host integrated container applications
#
# MIT License (C) 2015

import os
from base.hica_base import *

class EnvPassthroughInjector(HicaInjector):
  def get_description(self):
    return "Bind mounts current environment into the container"

  def get_config_key(self):
    return "io.hica.env_passthrough"

  def get_injected_args(self):
    return (("--env", HicaValueType.FULLENV, os.environ),)

def register(context):
  obj = EnvPassthroughInjector()
  context[obj.get_config_key()] = obj
