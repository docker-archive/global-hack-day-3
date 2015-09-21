"use strict"

var mongoWrapper = require("./MongoWrapper.js");
var toMongodb = require("jsonpatch-to-mongodb");
var jsonpatch = require("fast-json-patch");
var swaggerObject = require("../swagger/swagger.json");
var spec = require("swagger-tools").specs.v2;
var ProjectModel = function (data) {
   var self = this;
}

ProjectModel.init = function (options) {
   var self = this;
   return new Promise(function (resolve, reject) {
      resolve("ProjectModel initialized.");
   });
}

// Static methods

ProjectModel.ReadAllProjects = function () {
   return new Promise(function (resolve, reject) {
      mongoWrapper.db.collection("Projects").find({}).toArray(function (err, projects) {
         if (err) {
            reject(err);
         }
         else {
            if (projects.length > 0) {
               resolve(projects);
            }
            else {
               reject(404);
            }
         }
      });
   });
}


ProjectModel.CreateProject = function (projectObject) {
   return new Promise(function (resolve, reject) {
      mongoWrapper.db.collection("Projects").insert(projectObject, function (err, result) {
         if (!err && result.ops.length > 0) {
            resolve(result.ops[0]);
         }
         else if (err.code = 11000) {
            console.error("ProjectModel.CreateProject({slug: %s}): Attempt to create duplicate.", projectObject.slug)
            reject(400.11000);
         }
         else {
            console.error("ProjectModel.CreateProject({slug: %s}): %s", proejctObject.slug, err);
            reject(err);
         }
      });
   });
}


ProjectModel.ReadProjectByPermalink = function (projectSlug) {
   return new Promise(function (resolve, reject) {
      mongoWrapper.db.collection("Projects").findOne({ "slug": projectSlug }, function (err, result) {
         if (err) {
            reject(err);
         }
         else {
            if (result) {
               resolve(result);
            }
            else {
               reject(404);
            }
         }
      });
   });
}

// Wrap Swagger Validate Model in a Promise
var validateObject = function (swaggerObject, swaggerPath, objectToValidate) {
   return new Promise(function (resolve, reject) {
      spec.validateModel(swaggerObject, swaggerPath, objectToValidate, function (err, result) {
         if (!err && !result) {
            resolve();
         }
         else {
            var reason = err || result;
            reject(reason);
         }
      });
   });
}


ProjectModel.PatchProjectByPermalink = function (projectSlug, patchObject) {
   return new Promise(function (resolve, reject) {
      ProjectModel.ReadProjectByPermalink(projectSlug).then(function (projectObject) {
         jsonpatch.apply(projectObject, patchObject);
         ProjectModel.UpdateProjectByPermalink(projectSlug, projectObject).then(function (newProjectObject) { 
            resolve(newProjectObject);
         }).catch(function (reason) { 
            reject(reason);
         });
      }).catch(function (reason) {
         reject(reason);      
      });
   });
}

// Validates newProjectObject against schema before saving it. newProjectObject must contain
ProjectModel.UpdateProjectByPermalink = function (projectSlug, newProjectObject) {
   return new Promise(function (resolve, reject) {
      delete newProjectObject._id; // We find by slug
      var criteria = {
         "slug": projectSlug
      }
      var options = {
         "upsert": false,
         "multi": false
      }
      //validateObject(swaggerObject, "#/definitions/ProjectObject", newProjectObject).then(function () {
         mongoWrapper.db.collection("Projects").update(criteria, newProjectObject, options).then(function () {
            resolve(newProjectObject)
         }).catch(function (reason) {
            reject(reason);
         });
      //}).catch(function (reason) {
      //   reject(reason);
      //});
   });
}


ProjectModel.DeleteProjectByPermalink = function (projectSlug) {
   return new Promise(function (resolve, reject) {
      mongoWrapper.db.collection("Projects").deleteOne({ "slug": projectSlug }).then(function (result) {
         if (result.deletedCount === 1) {
            resolve();
         }
         else {
            reject(404);
         }
      }).catch(function (reason) {
         console.error("ProjectModel.DeleteProjectBySlug(%s): %s", projectObject, reason);
         reject(reason);
      });
   });
}


// Instance Methods

ProjectModel.prototype.data = {}
module.exports = ProjectModel;