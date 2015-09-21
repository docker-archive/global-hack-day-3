# FlockerProfiles

Storage Profiles to support SLAs.

Team Members: Madhuri Yechuri (ClusterHQ), Ryan Wallner (EMC), Sean McGinnis (Dell)

# Motivation

Enterprise applications have SLA needs with respect to storage. A database application and log analytics application are not created equal. Top of the line storage provides have knobs available to cater to these SLA-specific needs. What is missing from this equation is the ability to have a mapping of application SLA to backend storage feature set needed to service the SLA.

# Design

We followed below guidelines:

- Design Profiles top down: There were two ways of approaching the problem:
1) Expose all the storage knobs (IOPS, type of storage (SSD/HDD), compression, replication factor, dedup, etc) up to the application (docker-compose) manifest.
2) Bring application's storage requirements (high performance, security, don't care, etc) down to storage.

We went with option 2 because it is a cleaner design.

We defined a profile as a name that provides certain guarantees. We propose two profiles in this POC:

1) ``default``: the application does not care about storage. We manifest cheapest storage option for this profile.
2) ``gold``: the application cares about performance. We provide suitable storage will satisfy application's performance needs. 


# Where do i ask for a profile?

We drive profiles using Docker Compose, and Docker Flocker plugin.

Sample usage:

```
docker run --name mongo -p 27017:27017 --volume-driver=flocker -v highperfvolume@gold:/data mongo:3.0.4
```
will create a high performance volume for MongoDB using Flocker Docker plugin.



```
docker run --name testapp --volume-driver=flocker -v cheapvolume@default:/data busybox sh -c "echo hello > /data/state.txt"
```
will create a cheap volume without performance guarantees.

The intepretation of ``gold`` and ``default`` will vary from backend to backend. For example, ``gold`` on EBS might translate to {``IOPS``: 10000, ``encrypted``: True, ``volume_type``: ``standard``}, which on ScaleIO, it might translate to {``IOPS``: 12000, ``replication_factor``: 3, ``type``: ``ssd``}. The beauty of a profile is that these individual settings are masked out to the user. As far as the user (application) is concerned, ``gold`` will provide a volume suitable for high performance workloads.


# Prototype Implementations

We demostrate our POC using 3 popular storage enviroments: Amazon EBS, EMC ScaleIO, and OpenStack Cinder.

## Amazon EBS

[Flocker support and EBS implementation](https://github.com/ClusterHQ/flocker/compare/profile_metadata)

## EMC ScaleIO

[ScaleIO Prototype](https://github.com/emccorp/scaleio-flocker-driver/tree/scaleio-profiles-hackday)

## OpenStack Cinder

# Acknowledgements

We thank:

- ClusterHQ Labs and Engineering, EMC, and Dell for facilitating productive collaboration.

- Docker Inc for providing a venue for prototyping our collective thoughts and encouraging innovation.
