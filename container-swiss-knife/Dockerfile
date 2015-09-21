FROM python:2.7.10
MAINTAINER Jakub Veverka <jakub@appuri.com>

ENV USER=csk
ENV PYTHONPATH=/csk

# Create user
RUN useradd -m $USER

ADD csk /csk/csk
ADD requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

WORKDIR /csk
USER $USER

ENTRYPOINT ["python", "csk/cli/main.py"]
