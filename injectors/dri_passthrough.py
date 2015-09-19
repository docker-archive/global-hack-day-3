# vim: set fileencoding=utf-8
# Pavel Odvody <podvody@redhat.com>
#
# HICA - Host integrated container applications
#
# MIT License (C) 2015

from base.hica_base import *

class DriPassthroughInjector(HicaInjector):
  def get_description(self):
    return "Bind mounts direct rendering interface devices (DRI) into the container"

  def get_config_key(self):
    return "io.hica.dri_passthrough"

  def get_injected_args(self):
    return (("--dri-passthrough-path", HicaValueType.DEVICE | HicaValueType.GLOB, "/dev/dri/*"),)

def register(context):
  obj = DriPassthroughInjector()
  context[obj.get_config_key()] = obj
