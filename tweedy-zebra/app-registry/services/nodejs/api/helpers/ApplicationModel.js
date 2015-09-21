"use strict"

var mongoWrapper = require("./MongoWrapper.js");

var ApplicationModel = function (data) {
   var self = this;
}

ApplicationModel.init = function (options) {
   var self = this;
   return new Promise(function (resolve, reject) {
      resolve("ApplicationModel initialized.");
   });
}

// Static methods

ApplicationModel.ReadAllApplicationsByProjectSlug = function (projectSlug) {
   return new Promise(function (resolve, reject) {
      var criteria = {
         "slug": projectSlug,
      }

      var projection = {
         "applications": 1
      }
      
      mongoWrapper.db.collection("Projects").find(criteria).toArray(function (err, results) {
         if (err) {
            reject(err);
         }
         else {
            if (results.length > 0 && results[0].applications) {
               resolve(results[0].applications);
            }
            else {
               reject(404);
            }
         }
      });
   });
}


ApplicationModel.CreateApplicationByProjectSlug = function (ApplicationObject) {
   return new Promise(function (resolve, reject) {
      mongoWrapper.db.collection("Applications").insert(ApplicationObject, function (err, result) {
         if (!err) {
            resolve(result);
         }
         else if (err.code = 11000) {
            console.error("ApplicationModel.CreateApplication({slug: %s}): Attempt to create duplicate.", ApplicationObject.slug)
            reject(400.11000);
         }
         else {
            console.error("ApplicationModel.CreateApplication({slug: %s}): %s", proejctObject.slug, err);
            reject(err);
         }
      });
   });
}


ApplicationModel.ReadApplicationByPermalink = function (Applicationslug) {
   return new Promise(function (resolve, reject) {
      mongoWrapper.db.collection("Applications").findOne({ "slug": Applicationslug }, function (err, doc) {
         if (err) {
            reject(err);
         }
         else {
            if (doc) {
               resolve();
            }
            else {
               reject(404);
            }
         }
      });
   });
}


ApplicationModel.UpdateApplicationByPermalink = function (ApplicationObject) {
   return new Promise(function (resolve, reject) {
      mongoWrapper.db.collection("Applications").findOne({ "slug": Applicationslug }, function (err, doc) {
         if (err) {
            reject(err);
         }
         else {
            resolve(doc);
         }
      });
   });
}


ApplicationModel.DeleteApplicationByPermalink = function (Applicationslug) {
   return new Promise(function (resolve, reject) {
      mongoWrapper.db.collection("Applications").deleteOne({ "slug": Applicationslug }).then(function (result) {
         if (result.deletedCount === 1) {
            resolve();
         }
         else {
            reject(404);
         }
      }).catch(function (reason) {
         console.error("ApplicationModel.DeleteApplicationBySlug(%s): %s", ApplicationObject, reason);
         reject(reason);
      });
   });
}
// Instance Methods

ApplicationModel.prototype.data = {}
module.exports = ApplicationModel;