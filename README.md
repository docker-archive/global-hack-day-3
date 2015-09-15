HICA (Host Integrated Container Applications)
---------------------------------------------
[hɑɪkː]

The goal of this project is to define a set of image label metadata 
and launcher tooling that understands said metadata to provide for
smooth experience running containerized applications with tight
integration with the host operating system.

Example:
 I create a Docker image with nightly build of Chrome, that I want to
use for testing my web pages alongside the stable version that comes
from system/google repos.
After creating the image, to have Chrome really working, you also need
to pass some configuration from the host, like Xsocket, sound device
and perhaps bind-mounting your `$HOME/.chrome` so that you can preserver
some state.
So I label the image with the following set of labels:
```
 LABEL com.hica.xsocket_passthrough=1 com.hica.sound_device=1 com.hica.bind_home=1
```
Then comes the client tool, docker-hica, which when given such image as
a target first reads those labels and figures out what to do with them.
In the end, to run such application you need to simply:
```
 $ docker-hica podvody/chrome-nightly
 The image requests the following capabilities:
 - X socket passthrough
 - Sound device
 - Bind $HOME

 Proceed [y/Y/n/N]? [n]
```

Images will be most likely distributed in the form of Dockerfiles and
compiled on demand. This should allow for:
```
 $ docker-hica --rebuild --env='COMMIT=65da345998bc3b1d' --tag podvody/chrome-nightly-test132 podvody/chrome-nightly
```
Which says "create a new image tagged ... from upstream commit ... and
base image ...".

HICA will be coded in Python.
