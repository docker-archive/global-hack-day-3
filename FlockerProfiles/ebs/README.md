# Design details of EBS implementation

## Profile discovery

We seed EBS storage driver with ``default`` and ``gold`` profiles. Users can potentially define custom profiles that can be discovered by the driver.

## Available profiles

### default

```
IOPS: None
encrypted: False
volume_type: standard
snapshot: None
```

### gold

```
IOPS: max(volume_size * 30, 100)
encrypted: True
volume_type: io1
snapshot: None
```
