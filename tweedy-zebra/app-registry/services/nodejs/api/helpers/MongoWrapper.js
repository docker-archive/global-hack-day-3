var MongoClient = require("mongodb").MongoClient;

var MongoWrapper = function () { }

MongoWrapper.init = function (config) {
   var self = this;
   
   return new Promise(function (resolve, reject) {
      MongoClient.connect(config.connectionString, function (err, db) {
         if (!err) {
            // Todo: iterate collections and attach them directly to MongoWrapper so we can skip the db in MongoWrapper.db.collection()
            MongoWrapper.db = db;
            resolve(self);
         }
         else {
            reject(err);
         }
      });
   });
}
module.exports = MongoWrapper;