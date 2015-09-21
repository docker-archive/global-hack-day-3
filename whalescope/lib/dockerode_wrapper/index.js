/**
*# (c) Copyright 2014 Hewlett-Packard Development Company, L.P.
*#
*#   Licensed under the Apache License, Version 2.0 (the "License");
*#   you may not use this file except in compliance with the License.
*#   You may obtain a copy of the License at
*#
*#       http://www.apache.org/licenses/LICENSE-2.0
*#
*#   Unless required by applicable law or agreed to in writing, software
*#   distributed under the License is distributed on an "AS IS" BASIS,
*#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*#   See the License for the specific language governing permissions and
*#   limitations under the License.
*/
'use strict';

var Docker = require('dockerode');
var config = require('./config');
var myDocker = new Docker(config);

module.exports = {
  //Returns a List of Containers
  //callback(error, containers):
  //  On success: containers will be undefined
  //  On error: error will be not null
  listContainers: function(callback) {
    myDocker.listContainers({all: true}, function(err, containers) {
      if (err){
        callback(err);
      }else{
        var i;
        for (i=0; i<containers.length; i++){

        }
        callback(null, containers);
      }
    });
  },
  //Inspects a container
  //callback(error, data):
  //  On success: error will be undefined
  //  On error: error will be not null
  inspectContainer: function(containerId, callback) {
    // create a container entity. does not query API
    var container = myDocker.getContainer(containerId);

    // query API for container info
    container.inspect(function (err, data) {
      if (err){
        callback(err);
      }else{
        callback(null, data);
      }
    });
  },
  //Restart a container
  //callback(error, data):
  //  On success: error will be undefined
  //  On error: error will be not null
  startContainer: function(containerId, callback) {
    // create a container entity. does not query API
    var container = myDocker.getContainer(containerId);

    // query API for container info
    container.start(function (err, data) {
      if (err){
        callback(err);
      }else{
        callback(null, data);
      }
    });
  },
  //Removes a container
  //callback(error, data):
  //  On success: error will be undefined
  //  On error: error will be not null
  removeContainer: function(containerId, callback) {
    // create a container entity. does not query API
    var container = myDocker.getContainer(containerId);

    // query API for container info
    container.remove(function (err, data) {
      if (err){
        callback(err);
      }else{
        callback(null, data);
      }
    });
  }
};
