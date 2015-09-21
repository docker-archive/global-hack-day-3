# docker log via mqtt

A log driver that publish logs to mqtt broker


## Why?

There're lots of iot device using mqtt protocol to communicate with other devices or server, especially when the network is unstable. This project adds a log driver to docker. Currently we cannot add a log driver via an external plugin, so it's added into docker's source. After sending logs to the mqtt broker, we can use another mqtt client to subscribe the logs and forward to logstash, fluentd, or some hosted log services such like loggly.

## P.S.

docker is added as a git submodule. source code is here <https://github.com/waitingkuo/docker/tree/mqtt>


## Usage

    $ docker run --log-driver mqtt --log-opt mqtt-host=MQTT_HOST [IMAGE]

## Quick Start 1 - use the hosted mqtt broker

(1). build the new docker binary. you can also use the binary in the bin directory

(2). run the docker daemon

    $ docker daemon

(3). go to http://www.hivemq.com/demos/websocket-client/ fill Host as "107.170.210.155", port as 9001, click connect

(4). switch to subscriptions, click "add new topic subscription", modify topic as "docker-log/#", and then click subscribe

(5). run the container with log driver as mqtt, remember to set your MQTT_HOST, it'll echo hi for each second.

    $ docker run --log-driver mqtt --log-opt mqtt-host=107.170.210.155 ubuntu bash -c "while true; do echo hi; sleep 1; done"

(6). go back to the web page and check the result


## Quick Start 2 - run your own mqtt broker

(1). build the new docker binary. you can also use the binary in the bin directory

(2). run the new docker daemon

    $ docker daemon

(3). Run a mqtt server, and then run another mqtt client to subscriber all the logs

    $ cd demo-server
    $ docker-compose up -d mosquitto
    $ docker-compose up subscriber

(4). run the container with log driver as mqtt, remember to set your MQTT_HOST, it'll echo hi for each second.

    $ docker run --log-driver mqtt --log-opt mqtt-host=MQTT_HOST ubuntu bash -c "while true; do echo hi; sleep 1; done"

(5). go back to your subscriber (in step2), the log is now forward to the subcriber via mqtt broker


## Other parameters

* mqtt-host: the ip for mqtt broker (required)
* mqtt-port: the port for mqtt, default 1883
* mqtt-topic-prefix: default docker-log, the full topic the mqtt-topic-prefix + container_id
* mqtt-qos: qos level which is defined in mqtt protocol

