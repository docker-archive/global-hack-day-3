Label Metadata Definition for HICA
----------------------------------

All labels live in common namespace `io.hica`, each set of labels with defined
values and name of command line parameter for supplying the value is versioned 
under `schema` versions. 

## Label Schema v0.2.3

| Label | Command line | Values | Default Value |
|-------|--------------|--------|---------------|
| io.hica.xsocket_passthrough | --xsocket-path, --x-display-num | *path*, *string* | `/tmp/.X11-unix`, `DISPLAY=:0` |
| io.hica.dri_passthrough | --dri-passthrough-path | *glob* | `/dev/dri/*` |
| io.hica.machine_id | --machine-id-path | *path* | `/etc/machine-id`|
| io.hica.cuda | --cuda-device, --cuda-device-ctl, --cuda-device-uvm | *path*, *path*, *path* | `/dev/nvidia0`, `/dev/nvidiactl`, `/dev/nvidia-uvm` |
| io.hica.sound_device | --sound-device | *glob* | `/dev/snd*` |
| io.hica.pulse | --pulse | *path* | `/run/user/$UID/pulse/` |
| io.hica.bind_home | --home-path | *path* | `$HOME` |
| io.hica.bind_pwd | *none* | *none* | `$PWD` |
| io.hica.bind_users_groups | --users-path, --groups-path | *path*, *path* | `/etc/passwd`, `/etc/group` |
| io.hica.bind_localtime | --time-path | *path* | `/etc/localtime` |
| io.hica.env_passthrough | --env | `none`, `full` | `full` |
| io.hica.kvm_passthrough | --kvm-device | *path* | `/dev/kvm` |



