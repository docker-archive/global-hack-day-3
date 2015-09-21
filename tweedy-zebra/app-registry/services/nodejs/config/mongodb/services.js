db.Services.insert([
   {
      "slug": "mongodb",
      "description": "Implements a non-clustered MongoDb 3.0.6 database server.",
      "type": "server.db",
      "language": "javascript",
      "ports": [27017],
      "version": "3.0.6",
      "docker": {}

   },
   {
      "description": "Implements a non-clustered Postgres x.y.z database server.",
      "docker": {},
      "language": "sql",
      "ports": [],
      "slug": "postgres",
      "type": "server.db",
      "version": "?"
   },
   {
      "slug": "django",
      "description": "",
      "type": "server.app",
      "language": "python",
      "ports": [80, 443],
      "version": "0.12.7",
      "docker": {}
   },
   {
      "slug": "python",
      "description": "Python 2.7 on Ubuntu 14.04",
      "type": "language",
      "language": "python",
      "ports": [],
      "version": "2.7",
      "docker": {}
   },
   {
      "slug": "nodejs",
      "description": "",
      "type": "server.app",
      "language": "javascript",
      "ports": [80, 443],
      "version": "0.12.7",
      "docker": {}
   },
   {
      "slug": "external",
      "description": "An external API such as Twitter, Facebook, YouTube, etc.",
      "type": "webservice",
      "langauge": "unknown",
      "ports": [],
      "version": "1.0.0",
      "docker": {}
   }
], { w: 1 })