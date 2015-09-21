# Scenario demo

## Scenario 1: Using github code and deploy.

**Github:** https://github.com/tranhuucuong91/webapp_demo

**Dockerfile**
```Dockerfile
FROM alpine:3.2
MAINTAINER Tran Huu Cuong "tranhuucuong91@gmail.com"

RUN apk --update add py-pip

COPY code/requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

COPY code /code
WORKDIR /code

EXPOSE 5000
CMD ["python", "run.py"]
```

**docker-compose.yml**
```yml
web:
    image: tranhuucuong91/webapp_demo
    ports:
        - "80:5000"
    links:
        - redis:redis

redis:
    image: redis:3.0
```


## Scenario 2: Using public docker images and deploy, like wordpress.

**docker-compose.yml**
```yml
wordpress:
    image: wordpress:4.1
    links:
        - db:mysql
    ports:
        - 8080:80

db:
    image: mariadb
    environment:
        MYSQL_ROOT_PASSWORD: example
```

