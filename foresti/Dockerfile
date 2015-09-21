FROM golang:1.5

ENV DISTRIBUTION_DIR /go/src/github.com/n1tr0g/godoauth
ENV DOCKER_BUILDTAGS include_oss

WORKDIR $DISTRIBUTION_DIR
COPY . $DISTRIBUTION_DIR
COPY docs/config.yaml.sample /etc/docker/godoauth/config.yml

RUN make PREFIX=/go clean dep bin

EXPOSE 5002
ENTRYPOINT ["godoauth"]
CMD ["-config", "/etc/docker/godoauth/config.yml"]