/* 
 * Drops the db then recreates collections c/w indices
 */

db.dropDatabase();

db.createCollection("Projects");
db.createCollection("Services");
db.createCollection("ContainerHosts");

db.Projects.createIndex({ "slug": 1 }, { "unique": true, "name": "slug" });
db.Services.createIndex({ "slug": 1 }, { "unique": true, "name": "slug" });
db.ContainerHosts.createIndex({ "slug": 1 }, { "unique": true, "name": "slug" });