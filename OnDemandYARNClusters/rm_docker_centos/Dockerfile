FROM centos:7
MAINTAINER ss <sarjeetsingh@maprtech.com>
RUN rpm -Uvh http://repos.mesosphere.io/el/6/noarch/RPMS/mesosphere-el-repo-6-2.noarch.rpm
RUN yum install yum-utils -y
RUN yum-config-manager --add-repo http://yum.qa.lab/myriad
RUN yum-config-manager --add-repo http://yum.qa.lab/opensource
RUN yum --nogpgcheck install java-1.7.0-openjdk.x86_64 -y
RUN yum --nogpgcheck --exclude="mapr-compat-suse-5.5.5.34514.GA-1.x86_64" install mapr-cldb mapr-fileserver mapr-zookeeper -y
