FROM fedora:22
MAINTAINER Pavel Odvody <podvody@redhat.com>

LABEL io.hica.bind_pwd=1
LABEL io.hica.bind_home=1

ENV COMMIT=9a519e5be456a576114fbae4c2a0fce31f8e125b

RUN dnf install -y libbsd libbsd-devel make gcc\
    findutils git && rm -rf /var/dnf/cache/*

RUN (git clone https://github.com/aperezdc/signify && cd signify\
 && git checkout ${SIGNIFY_COMMIT} && make && make install && rm -rf /signify)

ENTRYPOINT ["signify"]
