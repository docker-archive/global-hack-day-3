FROM node:4

MAINTAINER Sean Macdonald <sean.macdonald@stjoseph.com>

#	bootstrap
RUN mkdir -p /usr/src/app
COPY ./package.json /usr/src/
WORKDIR /usr/src
RUN npm install
COPY ./ /usr/src/app/
WORKDIR /usr/src/app

#	Orchestra
LABEL io.sjc.orchestra.version="0.0.1"

CMD ["npm","start"]
EXPOSE 8888
