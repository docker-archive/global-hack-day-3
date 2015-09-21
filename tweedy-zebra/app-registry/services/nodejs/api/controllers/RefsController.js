"use strict";

var util = require("util"),
   Ref = require("../helpers/RefModel.js");

module.exports = {
   ReadAllRefsByApplicationSlug: ReadAllRefsByApplicationSlug,
//   CreateRefByPermalink: CreateRefByPermalink,
//   ReadRefByPermalink: ReadRefByPermalink,
//   UpdateRefByPermalink: UpdateRefByPermalink,
//   DeleteRefByPermalink: DeleteRefByPermalink
};

function ReadAllRefsByApplicationSlug(req, res, next) {
   var projectSlug = req.swagger.params.projectSlug.value;
   var applicationSlug = req.swagger.params.applicationSlug.value;

   Ref.ReadAllRefsByApplicationSlug(projectSlug, applicationSlug).then(function (Refs) {
      res.status(200).json(Refs);
   }).catch(function (reason) {
      if (reason === 404) {
         res.status(404).send("");
      }
      else {
         res.status(400).json({ "code": 400, "message": "An error occured on the server and has been logged." });
      }
   });
}