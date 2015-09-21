# FlockerProfiles

Storage Profiles to support SLAs.

Team Members: Madhuri Yechuri (ClusterHQ), Ryan Wallner (EMC), Sean McGinnis (Dell)

# Motivation

Enterprise applications have SLA needs with respect to storage. A database application and log analytics application are not created equal. Top of the line storage provides have knobs available to cater to these SLA-specific needs. What is missing from this equation is the ability to have a mapping of application SLA to backend storage feature set needed to service the SLA.

# Design

We followed below guidelines:

## Design Profiles top down

We considered the following options:

- Expose all the storage knobs (IOPS, type of storage (SSD/HDD), compression, replication factor, dedup, etc) up to the application (docker-compose) manifest.
- Bring application's storage requirements (high performance, security, don't care, etc) down to storage.

We went with option 2 because it offered cleaner design.

We defined ``profile`` as a name that provides certain guarantees. We propose two profiles in this POC:

- ``default``: the application does not care about storage characteristics. We manifest cheapest storage option for this profile.
- ``gold``: the application cares about performance. We provide suitable storage that will satisfy application's performance needs. 

## As an application, or a scheduler, where do request a profile?

We recommend driving profiles using Docker Compose via Docker Flocker plugin.

Examples:

```
docker run --name mongo -p 27017:27017 --volume-driver=flocker -v highperfvolume@gold:/data mongo:3.0.4
```
will create a high performance volume for MongoDB.


```
docker run --name testapp --volume-driver=flocker -v cheapvolume@default:/data busybox sh -c "echo hello > /data/state.txt"
```
will create a cheap volume without performance guarantees.

Not specifying a profile in a volume's ``name`` defaults to ``default`` profile.

The intepretation of ``gold`` and ``default`` will vary from backend to backend. For example, ``gold`` profile will translate to the following settings.

### EBS

```
IOPS: volume_size*30,
encrypted: True,
volume_type: io1
```

### ScaleIO

```
volume_type: u'thin_provision',
IOPS: 10000,
bandwidth: 1000000,
ram_cache: True

```
### Hedvig

```
<dedup_enable>false</dedup_enable>
<compress_enable>false</compress_enable>
<cache_enable>true</cache_enable>
<replication_factor>3</replication_factor>
<replication_policy>agnostic</replication_policy>
<disk_residence>ssd</disk_residence>

```

### ConvergeIO

```
iops:
min: 100
max: 1000 level: 5
local: Yes #node: alpha1 provision: thin service:
- compression: disabled
- dedupe: disabled
- encryption: disabled
- high-availability: disabled - replication: disabled
destination: none interval: 120
type: synchronous
- snapshot: disabled start: 1440 interval: 60
max: 10
type: SSD
```

The beauty of a profile is that these individual settings are masked out to the user. As far as the user (application) is concerned, ``gold`` will provide a volume suitable for high performance workloads.

# Prototype Implementations

We demostrate our POC using 3 popular storage enviroments: Amazon EBS, EMC ScaleIO, and OpenStack Cinder.

## Amazon EBS

[Flocker support and EBS implementation](https://github.com/ClusterHQ/flocker/compare/profile_metadata)

## EMC ScaleIO

[ScaleIO Prototype](https://github.com/emccorp/scaleio-flocker-driver/tree/scaleio-profiles-hackday)

## OpenStack Cinder

# Whats next

## Add Flocker profiles to Flocker Control Service's http endpoints:

- ``GET /v1/configuration/profiles`` to get all existing Flocker profiles across storage backends.
- ``POST /v1/configuration/profiles`` to create/update a Flocker profile.

## Update Flocker node agent to react to profile changes to a given dataset (volume)

If user (scheduler) updates a volume's existing profile, have Flocker dataset agent fire [apply_profile](https://github.com/ClusterHQ/flocker/compare/profile_metadata#diff-d4afce624ebc4d030e9de21aee00fdb9R936) to update volume settings on the storage backend.

# Open Issues

- Testing profiles with ``docker run`` on AWS Ubuntu 14.04 ran into [this issue](https://groups.google.com/forum/#!topic/docker-user/PVdrtb7-3Oo):

```
docker run --rm --volume-driver=flocker -v cheapvolume@/data busybox sh
```
hangs with the following symptoms
```
root@ip-172-31-1-54:~# ps -ef | grep "docker run"
root      9444  8851  0 04:25 pts/0    00:00:00 docker run -d -v t6:/d6 --volume-driver=flocker busybox sh
root      9576  9559  0 04:36 pts/5    00:00:00 grep --color=auto docker run
root@ip-172-31-1-54:~# strace -p 9444
Process 9444 attached
epoll_wait(4, 
root@ip-172-31-1-54:/proc/9444/fd# ls
0  1  2  3  4
root@ip-172-31-1-54:/proc/9444/fd# ls -la 4
lrwx------ 1 root root 64 Sep 21 04:27 4 -> anon_inode:[eventpoll]
root@ip-172-31-1-54:/proc/9444/fd# cd ../fdinfo
root@ip-172-31-1-54:/proc/9444/fdinfo# cat 4
pos:    0
flags:  02000002
tfd:        3 events: 8000201d data:     7f837fb60340
root@ip-172-31-1-54:/proc/9444/fdinfo# 
```
# Acknowledgements

We thank:

- ClusterHQ Labs and Engineering, EMC, and Dell for facilitating productive collaboration.

- Docker Inc for providing a venue for prototyping our collective thoughts and encouraging innovation.

- David Calavera (Docker) for feedback on the idea at SF Hack Day Kickoff.
