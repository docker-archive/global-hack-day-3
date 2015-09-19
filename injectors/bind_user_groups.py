# vim: set fileencoding=utf-8
# Pavel Odvody <podvody@redhat.com>
#
# HICA - Host integrated container applications
#
# MIT License (C) 2015

from base.hica_base import *

class BindUsersGroupsInjector(HicaInjector):
  def get_description(self):
    return "Bind mounts users and groups into the container"

  def get_config_key(self):
    return "io.hica.bind_users_groups"

  def get_injected_args(self):
    return (("--users-path", HicaValueType.PATH, "/etc/passwd"),
        ("--groups-path", HicaValueType.PATH, "/etc/group"))

def register(context):
  obj = BindUsersGroupsInjector()
  context[obj.get_config_key()] = obj
