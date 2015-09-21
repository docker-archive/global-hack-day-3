FROM alpine 
MAINTAINER Suker200 <tan.luong1989@gmail.com>
RUN apk update
RUN apk add pcre pcre-dev zlib zlib-dev bash iproute2 ca-certificates 
RUN adduser -D -H -u 10000 -s /sbin/nologin www
RUN mkdir -p /build/nginx/
COPY nginx/ /build/nginx/
COPY config.cnf /
COPY init.sh /
COPY nginx.conf /
COPY index.html /
COPY minimonitor /
ENTRYPOINT ["/bin/sh"]
CMD ["/init.sh"]
EXPOSE 80
