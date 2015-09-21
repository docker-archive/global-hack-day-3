FROM ubuntu:14.04
MAINTAINER Alan Joseph<alanjosephmec@gmail.com>

RUN apt-get install -y software-properties-common \
	&& apt-add-repository -y ppa:vbernat/haproxy-1.5 \
	&& apt-get update \
	&& apt-get install -y curl python-pip haproxy nodejs npm openssh-server vim\
	&& curl -sSL https://get.docker.com/ | sh \
	&& ln -s /usr/bin/nodejs /usr/bin/node \
	&& pip install -U docker-compose \
	&& npm install -g pm2 \
# Confuguring sshd
	&& mkdir /var/run/sshd \
	&& echo 'root:dockerbox' | chpasswd \
	&& sed -i 's/PermitRootLogin without-password/PermitRootLogin yes/' /etc/ssh/sshd_config \
# SSH login fix. Otherwise user is kicked off after login
	&& sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile
EXPOSE 22 80

RUN git config --global url."https://".insteadOf git:// \
	&& git clone https://github.com/dockerx/global-hack-day-3.git \
	&& cd global-hack-day-3/DockerBox_Bangalore \
	&& npm install

RUN touch /dockerboxinit.sh \
	&& chmod +x /dockerboxinit.sh \
	&& echo \#\!/bin/bash >> /dockerboxinit.sh \
	&& echo 'make install' >> /dockerboxinit.sh

WORKDIR /global-hack-day-3/DockerBox_Bangalore

CMD sh -c /dockerboxinit.sh && /usr/sbin/sshd -D