/*
 * M O C K 
 */

"use strict";

var util = require("util"),
   mockProjects = require("../mocks/ProjectCollection.json");

module.exports = {
   ReadAllProjects: ReadAllProjects
};

function ReadAllProjects(req, res, next) {
   res.json(mockProjects);
}