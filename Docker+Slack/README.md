# Docker+Slack

A Slack integration to notify Docker events.

## How to get started

+ Set up [an incoming WebHook integration](https://my.slack.com/services/new/incoming-webhook) and get the Webhook URL.

+ Update `SLACK_URL` environemt variable in `docker-compose.yml` with the ` Webhook URL` you just got from Slack. 

+ Run it 
```
docker-compose up -d
```
