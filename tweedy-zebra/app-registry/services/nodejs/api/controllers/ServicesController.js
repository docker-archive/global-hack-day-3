"use strict";

var util = require("util"),
   Service = require("../helpers/ServiceModel.js");

module.exports = {
   ReadAllServicesByRefSlug: ReadAllServicesByRefSlug,
//   CreateServiceByPermalink: CreateServiceByPermalink,
//   ReadServiceByPermalink: ReadServiceByPermalink,
//   UpdateServiceByPermalink: UpdateServiceByPermalink,
//   DeleteServiceByPermalink: DeleteServiceByPermalink
};

function ReadAllServicesByRefSlug(req, res, next) {
   var projectSlug = req.swagger.params.projectSlug.value;
   var applicationSlug = req.swagger.params.applicationSlug.value;
   var refSlug = req.swagger.params.refSlug.value
   
   Service.ReadAllServicesByRefSlug(projectSlug, applicationSlug, refSlug).then(function (Services) {
      res.status(200).json(Services);
   }).catch(function (reason) {
      if (reason === 404) {
         res.status(404).send("");
      }
      else {
         res.status(400).json({ "code": 400, "message": "An error occured on the server and has been logged." });
      }
   });
}