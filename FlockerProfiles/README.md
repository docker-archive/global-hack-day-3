# FlockerProfiles

Enable containerized enterprise application SLAs using storage profiles.

Team Members: Madhuri Yechuri (ClusterHQ), Ryan Wallner (EMC), Sean McGinnis (Dell)

# Motivation

Enterprise applications have SLA needs with respect to storage. For example, a database application and a log analytics application are not created equal. Top of the line storage providers have knobs to deliver application-specific SLA needs. What is missing from this equation is the ability to have a mapping of application SLA to backend storage feature set needed to service the SLA.

# Design

We followed below guidelines:

## Flow SLAs top down

We considered the following options:

- Expose all the storage knobs (IOPS, type of storage (SSD/HDD), compression, replication factor, dedup, etc) up to the application (docker-compose) manifest.
- Bring application's storage requirements (high performance, security, don't care, etc) down to storage.

We went with option 2 because it offered cleaner design.

We defined ``profile`` as a name that describes the set of storage features most important to the application. We propose two profiles in this POC:

- ``default``: application does not care about storage characteristics. We manifest cheapest storage option for this profile.
- ``gold``: application's SLA depends on high (IOPS) storage performance. We provide suitable storage that will satisfy application's performance needs.

## Single click activation

We recommend using FlockerProfiles with Docker Compose via Docker Flocker plugin.

Examples:

```
docker run --name mongo -p 27017:27017 --volume-driver=flocker -v highperfvolume@gold:/data mongo:3.0.4
```
will create a high performance volume for MongoDB.


```
docker run --name testapp --volume-driver=flocker -v cheapvolume@default:/data busybox sh -c "echo hello > /data/state.txt"
```
will create a cheap volume for your test container.

The minimal change from existing functionality is that instead of specifying volume as ``-v name:/data``, you would tag along profile as ``-v name@profile:/data``. For backward compatibility and ease of use, not specifying a profile defaults to a ``default`` profile: ``-v name@default:/data`` is equivalent to ``-v name:/data``.

### Demo

[![FlockerProfiles on EBS](http://img.youtube.com/vi/nOByh6UMUl0/0.jpg)](https://youtu.be/nOByh6UMUl0)


The intepretation of ``gold`` and ``default`` will vary from backend to backend, the details of which will be [made available](https://github.com/ClusterHQ/flocker/compare/profile_metadata#diff-3f0c0887dbd1be3781b80c091915bd2fR612) to schedulers upon request. For example, ``gold`` profile will translate to the following settings.

### [Amazon EBS](https://aws.amazon.com/ebs/)

```
IOPS: volume_size*30
encrypted: True
volume_type: io1
```

### [EMC ScaleIO](http://www.emc.com/storage/scaleio/index.htm)

```
volume_type: thin_provision
IOPS: 10000
bandwidth: 1000000
ram_cache: True

```
### [Hedvig](http://www.hedviginc.com/product)

```
<dedup_enable>false</dedup_enable>
<compress_enable>false</compress_enable>
<cache_enable>true</cache_enable>
<replication_factor>3</replication_factor>
<replication_policy>agnostic</replication_policy>
<disk_residence>ssd</disk_residence>

```

### [ConvergeIO](http://www.convergeio.com/)

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

The advantage of using a FlockerProfile is that these individual settings are masked out to the user. As far as the user (application) is concerned, ``gold`` will provide a volume suitable for high performance workloads.

# Prototype Implementations

We demostrate our POC using 3 popular storage enviroments: Amazon EBS, EMC ScaleIO, and OpenStack Cinder.

## Amazon EBS

[Flocker support and EBS implementation](https://github.com/ClusterHQ/flocker/compare/profile_metadata)

## EMC ScaleIO

[ScaleIO Prototype](https://github.com/emccorp/scaleio-flocker-driver/tree/scaleio-profiles-hackday)

## OpenStack Cinder

[Cinder Prototype](https://github.com/ClusterHQ/flocker/commit/1b5ef85b8874f1ba3b4cf42d39f3583dd9134904)

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

- ClusterHQ, EMC, and Dell for facilitating productive collaboration.

- Docker Inc for providing venue for prototyping our collective thoughts and encouraging innovation.

- David Calavera (Docker) for feedback on the idea at SF Hack Day Kickoff.
