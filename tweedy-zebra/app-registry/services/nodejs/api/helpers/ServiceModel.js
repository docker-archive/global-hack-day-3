"use strict"

var mongoWrapper = require("./MongoWrapper.js");

var ServiceModel = function (data) {
   var self = this;
}

ServiceModel.init = function (options) {
   var self = this;
   return new Promise(function (resolve, reject) {
      resolve("ServiceModel initialized.");
   });
}

ServiceModel.ReadAllServicesByRefSlug = function (projectSlug, applicationSlug, refSlug) {
   return new Promise(function (resolve, reject) {
      var criteria = {
         "slug": projectSlug
      }
      
      var projection = {}
      projection["applications." + applicationSlug + ".refs." + refSlug + ".services"] = 1;
      
      mongoWrapper.db.collection("Projects").find(criteria, projection).toArray(function (err, results) {
         if (err) {
            reject(err);
         }
         else {
            if (results.length > 0 && results[0].applications[applicationSlug].refs) {
               resolve(results[0].applications[applicationSlug].refs[refSlug].services);
            }
            else {
               reject(404);
            }
         }
      });
   });
}

module.exports = ServiceModel;