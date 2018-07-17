var gulp = require('gulp');
var typedoc = require("gulp-typedoc");
var swagger = require('./scripts/swagger');
var swaggerGenerator = require('gulp-apidoc-swagger');

gulp.task("generate-docs", () => {
    return gulp
        .src(["src/core/**/*.ts"])
        .pipe(typedoc({
            module: "commonjs",
            target: "es6",
            out: "docs/documentation/",
            experimentalDecorators: true,
            ignoreCompilerErrors: true,
            name: "Puma Pay Framework v1"
        }))
    ;
});

gulp.task('generate-swagger', function(){
    swaggerGenerator.exec({
        src: "src/api/v1/",
        dest: "docs/api"
    });

    swagger.patch('./docs/api/swagger.json');
});

gulp.task('default', ['generate-swagger', 'generate-docs']); 