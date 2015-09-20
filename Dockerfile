FROM python:3.5.0

RUN echo "deb http://http.debian.net/debian jessie-backports main" >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y docker.io

RUN pip install redis

ADD . /usr/src/myapp/

WORKDIR /usr/src/myapp/

ENTRYPOINT ["python", "main.py"]