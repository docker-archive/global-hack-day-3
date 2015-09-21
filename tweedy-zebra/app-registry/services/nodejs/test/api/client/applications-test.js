'use strict';
var chai = require('chai');
var ZSchema = require('z-schema');
var validator = new ZSchema({});
var supertest = require('supertest');
var api = supertest('http://localhost:10010'); // supertest init;
var expect = chai.expect;

require('dotenv').load();

describe('/applications', function() {
  describe('get', function() {
    it('should respond with 200 Success', function(done) {
      /*eslint-disable*/
      var schema = {
        "type": "array",
        "items": {
          "description": "An Application Object including previously system generated UUID and ephemeralPort.",
          "type": "object",
          "required": [
            "name"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "The lowercase and dash-separated canonical name for this application."
            },
            "description": {
              "type": "string",
              "description": "Unambiguously describes this specific SJC application."
            },
            "address": {
              "type": "string",
              "format": "uri",
              "description": "The production/public domain."
            },
            "version": {
              "type": "string",
              "description": "The SemVer version of the current instance of an SJC application. See [http://semver.org/](http://semver.org/)"
            },
            "bugs": {
              "type": "string",
              "format": "uri",
              "description": "The web address of the issue tracker."
            },
            "docs": {
              "type": "string",
              "format": "uri",
              "description": "The web address of the wiki or documentation repository."
            },
            "branch": {
              "type": "string",
              "description": "The repository branch name for a specific instance of this application",
              "default": null
            },
            "branches": {
              "type": "array",
              "items": {
                "description": "An atomic branch record.",
                "type": "object",
                "properties": {
                  "X": {
                    "type": "string"
                  }
                }
              }
            },
            "cnames": {
              "type": "array",
              "description": "List of cnames used to access this instance",
              "items": {
                "description": "An internet cannonical name.",
                "type": "string"
              }
            },
            "host": {
              "type": "string",
              "description": "The host environment currently expected to be localhost or AWS.",
              "default": null
            },
            "audit": {
              "description": "The AuditInfo is becoming an SJC standard for conveying an auditable track of who made modifications when. It does not currently support the concept of 'what' was audited.",
              "type": "object",
              "required": [
                "created",
                "updated"
              ],
              "properties": {
                "created": {
                  "type": "object",
                  "required": [
                    "by",
                    "on"
                  ],
                  "properties": {
                    "by": {
                      "type": "string"
                    },
                    "on": {
                      "type": "string",
                      "format": "date-time"
                    }
                  }
                },
                "updated": {
                  "type": "object",
                  "required": [
                    "by",
                    "on"
                  ],
                  "properties": {
                    "by": {
                      "type": "string"
                    },
                    "on": {
                      "type": "string",
                      "format": "date-time"
                    }
                  }
                }
              }
            },
            "ephemeralPort": {
              "type": "string",
              "format": "int32",
              "default": null
            },
            "healthCheck": {
              "type": "string",
              "description": "Placeholder while we expand the idea of a heartbeat-like feature.",
              "format": "uri",
              "default": null
            },
            "remotes": {
              "type": "object",
              "description": "Git repositories.",
              "additionalProperties": {
                "description": "Describes a remote reference to a Git repository.",
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "E.g. origin, gitlab, corpus, etc."
                  },
                  "uri": {
                    "type": "string"
                  }
                }
              }
            },
            "commands": {
              "type": "object",
              "description": "Zero, one or more shell commands.",
              "additionalProperties": {
                "description": "A (currently) OS agnostic bash shell command. Note that there is no support for token expansion in this version.",
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "A unique name or key to reference the command."
                  },
                  "command": {
                    "type": "string",
                    "description": "The full command line to execute."
                  }
                }
              }
            },
            "services": {
              "type": "object",
              "description": "For now, a wrapper around Docker file.",
              "additionalProperties": {
                "description": "Is this a docker file?",
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Arbitrary and application unique name for the service."
                  },
                  "data": {
                    "type": "object",
                    "description": "an object."
                  }
                }
              }
            },
            "testRunners": {
              "type": "object",
              "description": "A list of available test runners that can be invoked within a running application instance.",
              "additionalProperties": {
                "description": "Meta information required to execute a test suite.",
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Arbitrary and application unique name for the test runner."
                  },
                  "runner": {
                    "type": "object",
                    "description": "Details, yet to be determined."
                  }
                }
              }
            },
            "tags": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      };

      /*eslint-enable*/
      api.get('/applications')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

    it('should respond with default Error', function(done) {
      /*eslint-disable*/
      var schema = {
        "required": [
          "message"
        ],
        "properties": {
          "message": {
            "type": "string"
          }
        }
      };

      /*eslint-enable*/
      api.get('/applications')
      .set('Accept', 'application/json')
      .expect('DEFAULT RESPONSE CODE HERE')
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

  });

});
