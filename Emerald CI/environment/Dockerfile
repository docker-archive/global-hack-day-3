FROM alpine
MAINTAINER Frederic Branczyk <fbranczyk@gmail.com>

RUN sed -i -e 's/v3\.2/edge/g' /etc/apk/repositories && \
    apk --update add bash docker=1.8.2-r2 git && \
    rm -rf /var/cache/apk/*
ADD https://bintray.com/artifact/download/emerald-ci/test-runner/test-runner_linux-amd64 /bin/test-runner
RUN chmod +x /bin/test-runner

RUN mkdir /project
WORKDIR /project

RUN mkdir /build
COPY script.sh /build/script.sh

ENTRYPOINT ["/build/script.sh"]

