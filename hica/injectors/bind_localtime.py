# vim: set fileencoding=utf-8
# Pavel Odvody <podvody@redhat.com>
#
# HICA - Host integrated container applications
#
# MIT License (C) 2015

from base.hica_base import *

class BindLocaltimeInjector(HicaInjector):
  def get_description(self):
    return "Bind mounts local time information into the container"

  def get_config_key(self):
    return "io.hica.bind_localtime"

  def get_injected_args(self):
    return (("--time-path", HicaValueType.PATH, "/etc/localtime"),)

def register(context):
  obj = BindLocaltimeInjector()
  context[obj.get_config_key()] = obj
