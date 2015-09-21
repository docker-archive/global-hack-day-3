from app import db
    

# class Config(db.EmbeddedDocument):
#     #container_ip_addr = db.IntField(required=True)
#     docker_inspect = db.DictField()

class Container(db.EmbeddedDocument):
    # container_id = db.StringField(max_length=20, 
    #                               unique=True,
    #                               required=True)
    # pool_id = db.StringField(max_length=30,
    #                          required=True)
    container_name = db.StringField()
    container_id = db.StringField()
    container_port = db.IntField()
    container_ip_addr = db.IntField()
    data_received = db.ListField()
    data_sent = db.IntField()
    time_sent = db.DateTimeField()
    time_received = db.DateTimeField()
    config =  db.DictField() #db.EmbeddedDocumentField(Config)


class Client(db.Document):
    """ 
    @containers:    {'<container_id' : <Object(Container)>}

    @ip_addr:    Client's IP Address 
    (to track multiple containers on same client)

    @client_result:    { 'client_IP' : <int> }
    @client_data:    { 'client_IP' : <list> }    

    """
    containers = db.DictField()
    ip_addr_num = db.IntField(unique=True)
    ip_addr = db.StringField()
    #client_data = db.DictField()
    #client_result = db.DictField()

    
# class Server(db.Document):
#     """
#     @connected_pools: 
#     1 pool(client) is a group of containers having same IP addr.
#     { 'client_IP' : [binded_ports] }

#     """
#     clients = db.DictField()
    
