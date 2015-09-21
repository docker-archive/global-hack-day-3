"use strict";

var SwaggerExpress = require("swagger-express-mw"),
   app = require("express")(),
   nconf = require("nconf"),
   bodyParser = require("body-parser"),
   ProjectModel = require("./api/helpers/ProjectModel.js"),  
   ApplicationModel = require("./api/helpers/ApplicationModel.js"),  
   RefModel = require("./api/helpers/RefModel.js"),  
   ServiceModel = require("./api/helpers/ServiceModel.js"),  
   MongoWrapper = require("./api/helpers/MongoWrapper.js");

module.exports = app; // for testing

nconf.env().file("./config.json");
var config = nconf.get();

config.connectionString = "mongodb://" + nconf.get("MONGODB_PORT_27017_TCP_ADDR") + ':' + nconf.get("MONGODB_PORT_27017_TCP_PORT") + "/" + nconf.get("dbname");

// Required by Docker
config.appRoot = __dirname;

// JSON Patch (http://tools.ietf.org/html/rfc6902) requires application/json-patch+json
app.use(bodyParser.json({
   type: function (req) {
      var contentType = req.headers["content-type"];
      return (contentType === "application/json" || contentType === "application/json-patch+json");
   }
}));

// Enable CORS
app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH, OPTIONS");
   res.header("Access-Control-Allow-Headers", "x-auth-simple, Origin, X-Requested-With, Content-Type, Accept, api_key, Authorization");
   next();
});


MongoWrapper.init(config).then(function (result) {
   console.log(result);
})
.then(function () {
   var promises = [
      ProjectModel.init(config),
      ApplicationModel.init(config),
      RefModel.init(config),
      ServiceModel.init(config)
   ];
   Promise.all(promises).then(function (results) {
      console.log(results);
   }).catch(function (reason) {
      console.error(reason);
   });
})
.catch(function (reason) {
   console.log(reason);
});

////.then(function (mongoWrapper) {
////   console.log(mongoWrapper);
////   var promises = [
////      ApplicationModel.init(config)
////   ]

//   // Todo: Should probably chain this such that SwaggerExpress.create does not run async to this method
//   Promise.all(promises).then(function (results) {
//      console.log(results);
//      resolve();
//   }).catch(function (reason) {
//      reject(reason);
//   });

//});

// Initialize all models

SwaggerExpress.create(config, function (err, swaggerExpress) {
   if (err) { throw err; }
   
   // install middleware
   swaggerExpress.register(app);
   
   // Custom error handler that returns JSON
   app.use(function (err, req, res, next) {
      console.error("ERROR:", JSON.stringify(err, null, 2));
      if (typeof err !== "object") {
         // If the object is not an Error, create a representation that appears to be
         err = {
            message: String(err) // Coerce to string
         };
      } else {
         // Ensure that err.message is enumerable (It is not by default)
         Object.defineProperty(err, "message", { enumerable: true });
      }
      
      // Return a JSON representation of #/definitions/ErrorResponse
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(err));
   });
   
   app.listen(config.PORT);
   console.log("Listening on %s", config.PORT);
});