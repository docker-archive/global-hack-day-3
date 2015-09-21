db.Projects.insert([
   {
      "name": "orchestra2",
      "slug": "orchestra2",
      "fullname": "SJC Applications Orchestra",
      "description": "Orchestrates and automates the creation and management of SJC applications.",
      "homepage": "https://stjosephcontent.atlassian.net/wiki/display/CLI/Orchestra",
      "applications": {
         "app-reg-2": {
            "slug": "app-reg",
            "name": "SJC Application Registry",
            "description": "Implements a queryable list of officially supported SJC applications.",
            "address": "app-reg.orchestra",
            "issues": "https://stjosephcontent.atlassian.net/secure/RapidBoard.jspa?rapidView=72",
            "docs": "https://stjosephcontent.atlassian.net/wiki/display/CLI/App+Registry",
            "remotes": {
               "not-origin-to-test-required-param": {
                  "ssh": "ssh://hello",
                  "https": "http://goodbye"
               },
               "origin": {
                  "ssh": "git@github.com:stjosephcontent/app-registry.git",
                  "https": "https://github.com/stjosephcontent/app-registry.git"
               }
            },
            "refs": {
               "reg-15-my-branch": {
                  "version": "1.3.1",
                  "testRunners": {
                     "angular": {},
                     "postman": {},
                     "server": {}
                  },
                  "scripts": {
                     "script1": "by your command.",
                     "script2": "these are not the droids you are looking for."
                  },
                  "services": {
                     "MongoDb": {
                        "description": "MongoDB backs app-reg for simple high-read, low-write throughput.",
                        "startup": "",
                        "image": "#/Services/mongodb"
                     },
                     "NodeApp": {
                        "description": "NodeJS is used for the bulk of the API implementation.",
                        "startup": "server.js",
                        "port": "3056",
                        "protocols": [
                           "http",
                           "https"
                        ],
                        "image": "#/Services/nodejs"
                     },
                     "tumblr": {
                        "description": "Tumblr's API is used for a crude CMS.",
                        "startup": "",
                        "port": "443",
                        "protocols": [
                           "https"
                        ],
                        "image": "#/Services/external"
                     }
                  },
                  "instances": {
                     "dev-tforster": {
                        "hostname": "174.117.35.248",
                        "cnames": [
                           "localhost"
                        ]
                     },
                     "seansMacBook": {
                        "hostname": "192.168.10.23",
                        "cnames": [
                           "localhost"
                        ]
                     },
                     "stage": {
                        "hostname": "stage.sjc.io",
                        "cnames": []
                     }
                  }
               }
            },
            "tags": [
               "registry",
               "directory-service",
               "applications"
            ],
            "audit": {
               "created": {
                  "by": "tforster",
                  "on": "2015-08-24T17:08:02.078Z"
               },
               "updated": {
                  "by": "smacdonald",
                  "on": "2015-08-24T17:08:02.078Z"
               }
            }
         }
      },
      "tags": [
         "cli",
         "command line",
         "registry",
         "app",
         "application",
         "directory",
         "directory service"
      ]
   }
], { w: 1 })