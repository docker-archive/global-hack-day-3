#What is Dockpot
Dockpot is a high interaction ssh-honeypot based on docker
<br>It' basically a NAT device that has the ability to act as an ssh proxy between the attacker and the honeypot (docker container in that case) and logs the attacker's activities 

It will create a new docker container for the first connection it gets,nat the ssh connections to it,destroy the container when the number of the connections to it is zero
<br>So no worries about resetting your high interaction machine ;)
![alt tag](http://www.gliffy.com/go/publish/image/7211985/L.png)

Dockpot is basically a Honssh with some tweaks to start the docker containers upon new connections and Honssh is using parts of the famous honeypot Kippo
So Please check the credits section 

#Running

Fill honssh.cfg with the right values of your choice and then run:

`./honsshctrl.sh START`

honsshctrl.sh is a shell script (provided by Black September) that runs HonSSH in the background using twistd.
<br>I have modified the script to start a test docker for the first run of the server and then it stops it

You can also run it manually with more configuration options. For example, to run in the foreground use:

`twistd -y honssh.tac -n`

But don't forget to start an ssh docker before you start that

##creating and ssh-service docker image
* https://docs.docker.com/examples/running_ssh_service/


#Credits

###HonSSH

http://code.google.com/p/honssh/
<br>HonSSH is designed to be used in conjuction with a high interaction honeypot. HonSSH sits between the attacker and the honey pot and creates two separate SSH conncetions.

Copyright (C) 2013 Thomas Nicholson





###Kippo
https://github.com/desaster/kippo
<br>Kippo is a medium interaction SSH honeypot designed to log brute force attacks

"Copyright (C) 2009 Upi Tamminen


###Docker
https://www.docker.com/


