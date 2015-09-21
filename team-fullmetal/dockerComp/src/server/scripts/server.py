#!/usr/bin/python

import socket
import json

data = (1,2,3,5,6,7)

# Create a socket object
s = socket.socket() 
# Reserve a port for your service.
host = socket.gethostname() # Get local machine name
# Reserve a port for your service.
port = 12347 
# Bind to the port
s.bind((host, port))        

# Now wait for client connection.
s.listen(5)                 
while True:
    # Establish connection with client.
    c, addr = s.accept()     
    print 'Got connection from', addr
    c.send(json.dumps((data)))
    # Close the connection
    c.close()                
