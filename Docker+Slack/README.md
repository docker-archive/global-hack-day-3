# Docker+Slack

A Slack integration to notify Docker events (starting and stopping containers for now).

![slacker-1.0](http://i.imgur.com/nSoNOQB.png)

## Requirements
+ Docker
+ Docker Compose
+ Slack account

## How to get started

+ Set up [an incoming WebHook integration](https://my.slack.com/services/new/incoming-webhook) and get the Webhook URL.

+ Update `SLACK_URL` environemt variable in `docker-compose.yml` with the ` Webhook URL` you just got from Slack. 

+ Run it using Docker Compose : `docker-compose up -d`


