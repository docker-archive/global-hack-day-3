# How to use Swagger, Swagger Project and Swagger Node

## TL;DR
* This project depends upon swagger.yaml which is now auto-generated. Edit at your own risk!
* Swagger.json is also auto-generated and is intended to be uploaded to apidoc.sjc.io to drive the end-developer API viewer.
* The working files consist of:
```
+ swagger
|    index.yaml  // Entry point and root of the final swagger.yaml file
|
+--- info        // Basic information describing the swagger project    
+--- definitions // All referenced object definitions for requests and responses
+--- paths       // All paths aka API endpoints
```
* User `gulp schema` to auto-generate everything.

## More to come...