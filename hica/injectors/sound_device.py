# vim: set fileencoding=utf-8
# Pavel Odvody <podvody@redhat.com>
#
# HICA - Host integrated container applications
#
# MIT License (C) 2015

from base.hica_base import *

class SoundDeviceInjector(HicaInjector):
  def get_description(self):
    return "Bind mounts sound device into the container"

  def get_config_key(self):
    return "io.hica.sound_device"

  def get_injected_args(self):
    return (("--sound-device", HicaValueType.DEVICE | HicaValueType.GLOB, "/dev/snd*"),)

def register(context):
  obj = SoundDeviceInjector()
  context[obj.get_config_key()] = obj
