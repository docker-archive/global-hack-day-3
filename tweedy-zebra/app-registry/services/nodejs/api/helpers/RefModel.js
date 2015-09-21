"use strict"

var mongoWrapper = require("./MongoWrapper.js");

var RefModel = function (data) {
   var self = this;
}

RefModel.init = function (options) {
   var self = this;
   return new Promise(function (resolve, reject) {
      resolve("RefModel initialized.");
   });
}


RefModel.ReadAllRefsByApplicationSlug = function (projectSlug, applicationSlug) {
   return new Promise(function (resolve, reject) {
      var criteria = {
         "slug": projectSlug
      }
      
      var projection = {}
      projection["applications." + applicationSlug + ".refs"] = 1;
      
      mongoWrapper.db.collection("Projects").find(criteria, projection).toArray(function (err, results) {
         if (err) {
            reject(err);
         }
         else {
            if (results.length > 0 && results[0].applications[applicationSlug].refs) {
               resolve(results[0].applications[applicationSlug].refs);
            }
            else {
               reject(404);
            }
         }
      });
   });
}

module.exports = RefModel;