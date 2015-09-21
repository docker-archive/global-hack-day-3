# docker log via mqtt

A log driver that publish logs to mqtt broker


## Why?

There're lots of iot device using mqtt protocol to communicate with other devices or server, especially when the network is unstable. This project adds a log driver to docker. Currently we cannot add a log driver via an external plugin, so it's added into docker's source. After sending logs to the mqtt broker, we can use another mqtt client to subscribe the logs and forward to logstash, fluentd, or some hosted log services such like loggly.

## Usage

    $ docker run --log-driver mqtt --log-opt mqtt-host=MQTT_HOST [IMAGE]

## Other parameters

* mqtt-host: the ip for mqtt broker (required)
* mqtt-port: the port for mqtt, default 1883
* mqtt-topic-prefix: default docker-log, the full topic the mqtt-topic-prefix + container_id
* mqtt-qos: qos level which is defined in mqtt protocol

