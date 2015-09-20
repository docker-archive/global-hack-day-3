Dockerfile Guidelines for HICA
------------------------------

You may have noticed already that the Dockerfiles in the `examples` folder are written in particular style,
let's overview some of the basic rules for producing great images. 

 1) Specify first `LABEL`'s and then `ENV`'s, so that the image metadata stays at the top
 
 2) Make all installation and cleanup happen as part of a single `RUN` command, which drastically
reduces the resulting size of the image

 3) Decouple installed/removed packages into `ENV` variables for easire auditing

 4) Make the application an `ENTRYPOINT` so the image is runnable without any additional parameters
 
That's pretty much it. I'll expand this section once I figure out more guidelines.

### Single `RUN` command operation
Continuing where point **2** above left off, why it is important to have only single `RUN` command in the 
Dockerfile.

Currently there's no canonical support for image layer squashing, which we can do externally, or by using
custom build system, but in general case we are better off using vanilla build facilities and thus accomodating
our Dockerfile structure to take advantage of some aspects of how Docker works internally when building images:
 - Each Dockerfile instruction `RUN, ENV, LABEL, CMD, ...` is executed in it's own layer
 - Instructions that do not change the file system (pretty much all beyond `RUN`) create an empty layer, which we can ignore

Long story short, practically, only `RUN` instructions create layers that consume disk space, but some extra layers couldn't hurt huh?
Well, it turns out that if you want to also cleanup after some operation, it can make crucial difference, excerpt from `examples/jq`:
```bash
RUN dnf install -y ${PKGS} \
 && (git clone https://github.com/stedolan/jq.git\
  && cd jq && autoreconf -fi && ./configure && make && make install)\
 && dnf remove -y ${PKGS} && rm -rf /jq /var/cache/dnf
```
We install some packages, clone a repo, configure, make, make install and then cleanup. The resulting layer will contain just the output of `make install`.
Let's compare that to a more granular use of `RUN`'s:
```bash
RUN dnf install -y ${PKGS}
RUN (git clone https://github.com/stedolan/jq.git\
  && cd jq && autoreconf -fi && ./configure && make && make install)
RUN dnf remove -y ${PKGS} && rm -rf /jq /var/cache/dnf
```
Here we'll have 3 layers, `layer 1` contains just the installed packages. `layer 2` contains the jq installation, the repository and the build artifacts.
And finally, `layer 3` will be full of whiteouts, which are special files in unioning file system to denote that the file was deleted.
In the end the cleanup operation that was supposed to save space of the resulting image actually expanded it.

While it makes sense to rapidly develop images using multiple `RUN` statements and utilizing the build artifact cache,
the resulting Dockerfile should be refactored into the single `RUN` form.
