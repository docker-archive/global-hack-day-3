"use strict";

var util = require("util"),
   Project = require("../helpers/ProjectModel.js"),
   swaggerTools = require("swagger-tools");

module.exports = {
   ReadAllProjects: ReadAllProjects,   
   CreateProject: CreateProject,
   UpdateProjectByPermalink: UpdateProjectByPermalink,
   ReadProjectByPermalink: ReadProjectByPermalink,
   PatchProjectByPermalink: PatchProjectByPermalink,
   DeleteProjectByPermalink: DeleteProjectByPermalink,
};


function ReadAllProjects(req, res, next) {
   Project.ReadAllProjects().then(function (projects) {
      res.status(200).json(projects);
   }).catch(function (reason) {
      if (reason === 404) {
         res.status(404).send("");
      }
      else {
         res.status(400).json({ "code": 400, "message": "An error occured on the server and has been logged." });
      }
   });
}


function CreateProject(req, res, next) {
   var projectRequest = req.swagger.params.body.value;
   
   Project.CreateProject(projectRequest).then(function (newProjectObject) {
      res.status(200).json(newProjectObject);
   }).catch(function (reason) {
      if (reason === 400.11) {
         res.status(400).json({ "code": 400, "message": "A project with that slug already exists." });
      }
      else {
         res.status(400).json({ "code": 400, "message": "An error occured on the server and has been logged." });
      }
   });
}


function ReadProjectByPermalink(req, res, next) {
   var projectSlug = req.swagger.params.projectSlug.value;
   
   Project.ReadProjectByPermalink(projectSlug).then(function (projectObject) {
      res.status(200).json(projectObject);
   }).catch(function (reason) {
      if (reason === 404) {
         res.status(404).send("");
      }
      else {
         res.status(400).json({ "code": 400, "message": "An error occured on the server and has been logged." });
      }
   });
}


function PatchProjectByPermalink(req, res, next) {
   var projectSlug = req.swagger.params.projectSlug.value;
   var patchObject = req.swagger.params.body.value;
   
   Project.PatchProjectByPermalink(projectSlug, patchObject).then(function (updatedProjectObject) {
      res.status(200).json(updatedProjectObject);
   }).catch(function (reason) {
      console.error(reason);
      res.status(400).send("");
   });
}

function UpdateProjectByPermalink(req, res, next) {
   var projectSlug = req.swagger.params.projectSlug.value;
   var patchObject = req.swagger.params.body.value;
   
   Project.UpdateProjectByPermalink(projectSlug, patchObject).then(function (updatedProjectObject) {
      res.status(200).json(updatedProjectObject);
   }).catch(function (reason) {
      console.error(reason);
      res.status(400).send("");
   });
}


function DeleteProjectByPermalink(req, res, next) {
   var projectSlug = req.swagger.params.projectSlug.value;
   
   Project.DeleteProjectByPermalink(projectSlug).then(function () {
      res.status(204).send("");
   }).catch(function (reason) {
      if (reason === 404) {
         res.status(404).send("");
      }
      else {
         res.status(400).json({ "code": 400, "message": "An error occured on the server and has been logged." });
      }
   });
}