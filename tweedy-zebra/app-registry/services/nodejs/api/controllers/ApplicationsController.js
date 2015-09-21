"use strict";

var util = require("util"),
   Application = require("../helpers/ApplicationModel.js");

module.exports = {
   ReadAllApplicationsByProjectSlug: ReadAllApplicationsByProjectSlug,
   CreateApplicationByProjectSlug: CreateApplicationByProjectSlug,
   ReadApplicationByPermalink: ReadApplicationByPermalink,
   UpdateApplicationByPermalink: UpdateApplicationByPermalink,
   DeleteApplicationByPermalink: DeleteApplicationByPermalink
};


function ReadAllApplicationsByProjectSlug(req, res, next) {
   var projectSlug = req.swagger.params.projectSlug.value;
   Application.ReadAllApplicationsByProjectSlug(projectSlug).then(function (Applications) {
      res.status(200).json(Applications);
   }).catch(function (reason) {
      if (reason === 404) {
         res.status(404).send("");
      }
      else {
         res.status(400).json({ "code": 400, "message": "An error occured on the server and has been logged." });
      }
   });
}


function CreateApplicationByProjectSlug(req, res, next) {
   Application.CreateApplicationByProjectSlug(req.swagger.params.body.value).then(function (newApplicationObject) {
      res.status(200).json(newApplicationObject);
   }).catch(function (reason) {
      if (reason === 400.11) {
         res.status(400).json({ "code": 400, "message": "A Application with that slug already exists." });
      }
      else {
         res.status(400).json({ "code": 400, "message": "An error occured on the server and has been logged." });
      }
   });
}


function ReadApplicationByPermalink(req, res, next) {
   Application.ReadApplicationBySlug(req.swagger.params.Applicationslug.value).then(function (ApplicationObject) {
      res.status(200).json(ApplicationObject);
   }).catch(function (reason) {
      if (reason === 404) {
         res.status(404).send("");
      }
      else {
         res.status(400).json({ "code": 400, "message": "An error occured on the server and has been logged." });
      }
   });
}


function UpdateApplicationByPermalink(req, res, next) {
   Application.UpdateApplicationBySlug(req.swagger.params.body.value).then(function (Applications) {
      res.status(200).json(Applications);
   }).catch(function (reason) {
      res.status(400).json({ "code": 400, "message": "An error occured on the server and has been logged." });
   });
}


function DeleteApplicationByPermalink(req, res, next) {
   Application.DeleteApplicationBySlug(req.swagger.params.Applicationslug.value).then(function () {
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