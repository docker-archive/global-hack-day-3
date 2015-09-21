# DEPLOYMENT INSTRUCTIONS

# To build the image, refer:
#  $ docker build -t docker_comp .

# To run using the container, refer the following command:
#  $ docker run -it -d docker_comp
###########################################################

FROM ubuntu:trusty
MAINTAINER Archit Sharma <archit.py@gmail.com>

# update and install deps
RUN apt-get update
RUN apt-get install -y python python-pip python-dev
RUN apt-get install -y nginx supervisor curl git
RUN pip install uwsgi Flask

# clone for github
# RUN git clone https://github.com/arcolife/dockerComp.git /opt/dockerComp/

#     OR
# add from source

RUN mkdir -p /opt/dockerComp/app/ /opt/dockerComp/conf/ /var/dockerComp/
ADD ./src/client/app /opt/dockerComp/app/
ADD ./src/client/conf /opt/dockerComp/conf/
ADD ./src/client/scripts /opt/dockerComp/scripts/
COPY ./src/client/scripts/test.sh /opt/dockerComp/

# configure services
RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf
RUN rm /etc/nginx/sites-enabled/default
RUN ln -s /opt/dockerComp/conf/app_nginx.conf /etc/nginx/sites-enabled/
RUN ln -s /opt/dockerComp/conf/app_supervisor.conf /etc/supervisor/conf.d/

EXPOSE 80

CMD ["/usr/bin/supervisord", "-n"]
