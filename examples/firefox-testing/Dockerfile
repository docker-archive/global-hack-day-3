FROM fedora:22
MAINTAINER Pavel Odvody <podvody@redhat.com>

LABEL io.hica.xsocket_passthrough=1
LABEL io.hica.machine_id=1
LABEL io.hica.bind_pwd=1

RUN dnf --enablerepo=updates-testing -y install firefox && rm -rf /var/cache/dnf

ENTRYPOINT ["firefox"]
