# vim: set fileencoding=utf-8
# Pavel Odvody <podvody@redhat.com>
#
# HICA - Host integrated container applications
#
# MIT License (C) 2015

import os
from base.hica_base import *

class BindHomeInjector(HicaInjector):
  def get_description(self):
    return "Bind mounts home directory ({0}) into the container".format(os.getenv("HOME"))

  def get_config_key(self):
    return "io.hica.bind_home"

  def get_injected_args(self):
    return (("--home-path", HicaValueType.PATH, os.getenv("HOME")),)

def register(context):
  obj = BindHomeInjector()
  context[obj.get_config_key()] = obj
