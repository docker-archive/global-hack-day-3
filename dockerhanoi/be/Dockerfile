FROM ubuntu:14.04
MAINTAINER Tran Huu Cuong "tranhuucuong91@gmail.com"

# using apt-cacher-ng proxy for caching deb package
# 192.168.99.1: vboxnet1
#RUN echo 'Acquire::http::Proxy "http://192.168.99.1:3142/";' > /etc/apt/apt.conf.d/01proxy
RUN echo 'Acquire::http::Proxy "http://172.17.42.1:3142/";' > /etc/apt/apt.conf.d/01proxy

RUN apt-get update
RUN apt-get install -y python3 python3-pip

COPY ./requirements.txt /tmp/requirements.txt
RUN pip3 install -r /tmp/requirements.txt

COPY . /code
WORKDIR /code

EXPOSE 5000
CMD ["python3", "run.py"]

