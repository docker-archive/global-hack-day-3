FROM adouang/docker-swarm:latest

ADD ./swarm /workspace/

ADD ./*.sh /workspace/

WORKDIR /workspace/

ENV SERF_VERSION 0.6.4_linux_amd64

RUN apt-get update

RUN apt-get install -y unzip

RUN curl -L https://dl.bintray.com/mitchellh/serf/$SERF_VERSION.zip -o serf.zip

RUN unzip serf.zip

RUN mv serf /usr/local/bin

RUN rm serf.zip
