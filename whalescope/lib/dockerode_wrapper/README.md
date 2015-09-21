I didnt had certs and this command was failing: docker-machine config default

I fixed with these command:
docker-machine regenerate-certs default




Followed: https://github.com/felixgborrego/docker-ui-chrome-app/wiki/windows#docker-machine




cd /cygdrive/c/Users/chavezom/.docker/machine/machines/default
cat cert.pem ca.pem >> clientcertchain.pem
openssl pkcs12 -inkey key.pem -in clientcertchain.pem -export -out import.pfx

password: Cxdsew32*


