FROM golang:1.5.1

RUN go get -d github.com/opencontainers/runc
WORKDIR /go/src/github.com/opencontainers/runc

RUN echo "deb http://ftp.us.debian.org/debian testing main contrib" >> /etc/apt/sources.list \
    && apt-get update \
    && apt-get install -y iptables criu/testing libseccomp2 libseccomp-dev

ENV GOPATH /go/src/github.com/opencontainers/runc/Godeps/_workspace:/go

RUN go build -tags "seccomp"  --ldflags '-extldflags "-static"'  -o runc .
RUN tar -czvf runc-0.3.tgz runc
