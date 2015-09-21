# vim: set fileencoding=utf-8
# Pavel Odvody <podvody@redhat.com>
#
# HICA - Host integrated container applications
#
# MIT License (C) 2015

import os
from base.hica_base import *

class BindPwdInjector(HicaInjector):
  def get_description(self):
    return "Bind mounts current working directory ({0}) into the container".format(os.getenv("PWD"))

  def get_config_key(self):
    return "io.hica.bind_pwd"

  def get_injected_args(self):
    return ((None, HicaValueType.PATH, os.getenv("PWD")),)

  def inject_config(self, config, args):
    super(BindPwdInjector, self).inject_config(config, args)
    # we also set in-container PWD to the same as on the host
    config.append('-w')
    config.append(args[0][1])

def register(context):
  obj = BindPwdInjector()
  context[obj.get_config_key()] = obj
