# vim: set fileencoding=utf-8
# Pavel Odvody <podvody@redhat.com>
#
# HICA - Host integrated container applications
#
# MIT License (C) 2015

import os
from base.hica_base import *

class PulseInjector(HicaInjector):
  def get_description(self):
    return "Bind mounts current user's Pulse audio socket into the container"

  def get_config_key(self):
    return "io.hica.pulse"

  def get_injected_args(self):
    return (("--pulse", HicaValueType.PATH, "/run/user/" + str(os.getuid()) + "/pulse"),)

def register(context):
  obj = PulseInjector()
  context[obj.get_config_key()] = obj
