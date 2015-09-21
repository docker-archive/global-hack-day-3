#   Image
FROM ubuntu:vivid
MAINTAINER Sean Macdonald <sean@crazyhorsecoding.com>

#   Machine
RUN apt-get update \
    && apt-get install -y apache2 \
    php5 \
    git \
    curl \
    tree \
    nginx \
    libapache2-mod-php5 \
    lynx \
    nano
VOLUME ["/var/www/html", "/var/log/apache2", "/etc/apache2/sites-available"]
COPY ./sites-available /etc/apache2/sites-available
RUN rm /var/www/html/*
COPY ./domains/colours/web /var/www/html
RUN a2ensite 000-default
EXPOSE 80

#   Orchestra
ENV ORCHESTRA_PROJECT tester
ENV ORCHESTRA_APP colours
ENV ORCHESTRA_SERVICE apache
LABEL io.sjc.orchestra.version="0.0.1"

#   Process
CMD ["apache2ctl","-DFOREGROUND"]
