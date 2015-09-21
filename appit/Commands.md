# Docker Volumes 

```bash
# creates data folder in busybox, and in reality it exists in /var/lib/docker/volumes 
docker run -v /data -ti busybox sh 
```

```bash
# can dynamically copy from container to-fro  
docker cp <File/Folder> <ContainerID>:<MountPointInContainer>
docker cp out3 high_ardinghelli:/data/ 
```

```bash
# persistent data on the host to be accessed by a container (give the absoulute path of your host directory) 
docker run -v /host:/container 
docker run -v /home/ronak/appit/docker-browser-box:/data -ti busybox sh
```

# Data Container 
```bash
docker run -ti --rm -e DISPLAY=$DISPLAY --volumes-from applcont --volumes-from metacont -v /tmp/.X11-unix:/tmp/.X11-unix firefox
```

# How to run appit.py
```bash
# To pull data from Dropbox server
./appit.py pull firefox

# To push data to Dropbox server
./appit.py push firefox

# To run the firefox container
./appit.py run firefox

# To search
./appit.py search firefox
```
