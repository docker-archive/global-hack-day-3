Firefox docker-hica example
---------------------------

This Dockerfile uses the following `injectors`:
 * `io.hica.xsocket_passthrough`
 * `io.hica.machine_id`
 * `io.hica.bind_pwd`

Firefox itself is installed from `fedora-updates-testing`, this allows for easy testing of
web pages using multiple versions of the same browsers.

If your xhost is not configured to accept local connections you can do so with:
`xhost +local:`


*This does not work with enabled *SELinux* yet*

```bash
$ cd examples/firefox
$ docker build -t firefox:1.0 .
$ cd ../..
# open google.com
$ ./docker-hica firefox:1.0 -- www.google.com
# open index.html from current directory
$ ./docker-hica firefox:1.0 -- index.html
```
