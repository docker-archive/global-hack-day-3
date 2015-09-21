# vim: set fileencoding=utf-8
# Pavel Odvody <podvody@redhat.com>
#
# HICA - Host integrated container applications
#
# MIT License (C) 2015

from base.hica_base import *

class MachineIdInjector(HicaInjector):
  def get_description(self):
    return "Bind mounts machine-id into the container"

  def get_config_key(self):
    return "io.hica.machine_id"

  def get_injected_args(self):
    return (("--machine-id-path", HicaValueType.PATH, "/etc/machine-id"),)

def register(context):
  obj = MachineIdInjector()
  context[obj.get_config_key()] = obj
