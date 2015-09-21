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

var dockerode = require('./index.js');

dockerode.listContainers(function (error, containers) {
    if (error){
      console.log(error);
    }else{
      console.log('===============================');
      console.log(containers);
      var i;
      for (i=0; i<containers.length;  i++){
        console.log('===============================');
        dockerode.inspectContainer(containers[i].id, function (error, data) {
          if (error){
            console.log(error);
          }else{
            console.log(data);       
          }
        });                    
      }            
    }
});



