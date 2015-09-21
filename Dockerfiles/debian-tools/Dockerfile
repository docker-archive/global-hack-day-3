FROM debian:jessie
MAINTAINER Jakub Veverka <jakub@appuri.com>

ENV USER=tools

# Create user
RUN useradd -m $USER

# Install tools
RUN \
    apt-get update \
    && apt-get install -y dnsutils

USER $USER

CMD while true;do sleep 10; done

