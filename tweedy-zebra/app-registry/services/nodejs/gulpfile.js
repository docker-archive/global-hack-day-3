var gulp = require("gulp"),
   resolve = require("json-refs").resolveRefs,
   fs = require("fs");

// VisualStudio's one downside is to add BOMs to all UTF-8 files
gulp.task("strip-bom", function () {
   // To-do: How does gulp.src search top down and replace files in place?
   return gulp.src('1.txt').pipe(stripBom()).pipe(gulp.dest('dest'));
});

// To-do: Gulpify this! It should use gulp.src and gulp.dest.
gulp.task("schema", function () {
   var $RefParser = require("json-schema-ref-parser");

   // Dereferencing parses a root file plus all externally referenced files and produces a single JSON schema object
   $RefParser.dereference("./api/swagger/index.yaml").then(function (schema) {

      // While we are not using a JSON version at the moment it might be useful for other tools in the future.
      fs.writeFile("./api/swagger/swagger.json", JSON.stringify(schema));

      // Since all the $refs are now inlined the .definitions object is redundant and can be deleted
      delete schema.definitions;

      // Bundle the schema c/w local references and save as our new swagger.yaml (required by swagger node)
      $RefParser.bundle(schema).then(function (schema) {
         fs.writeFile("./api/swagger/swagger.yaml", $RefParser.YAML.stringify(schema));
      });
   }).catch(function (reason) {
      console.error("Error dereferencing: %s", reason);
   });
});
