FROM fedora:22
MAINTAINER Pavel Odvody <podvody@redhat.com>

LABEL io.hica.bind_pwd=1

ENV PKGS='autoconf automake gcc git libtool make'

RUN dnf install -y ${PKGS} \
 && (git clone https://github.com/stedolan/jq.git\
  && cd jq && autoreconf -fi && ./configure && make && make install)\
 && dnf remove -y ${PKGS} && rm -rf /jq /var/cache/dnf

ENTRYPOINT ["jq"]
