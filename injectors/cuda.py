# vim: set fileencoding=utf-8
# Pavel Odvody <podvody@redhat.com>
#
# HICA - Host integrated container applications
#
# MIT License (C) 2015

from base.hica_base import *

class CudaInjector(HicaInjector):
  def get_description(self):
    return "Bind mounts CUDA devices into the container"

  def get_config_key(self):
    return "io.hica.cuda"

  def get_injected_args(self):
    return (("--cuda-device", HicaValueType.DEVICE, "/dev/nvidia0"), 
        ("--cuda-device-ctl", HicaValueType.DEVICE, "/dev/nvidiactl"),
        ("--cuda-device-uvm", HicaValueType.DEVICE, "/dev/nvidia-uvm"))

def register(context):
  obj = CudaInjector()
  context[obj.get_config_key()] = obj
