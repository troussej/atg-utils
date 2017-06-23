"use strict";
const gulp = require("gulp");
const del = require("del");
const ts = require('gulp-typescript');
const runSequence = require("run-sequence");
const tsProject = ts.createProject('tsconfig.json');

const targetFolder='dist';


gulp.task("clean", function(done) {
    return del([targetFolder], done);
});

gulp.task('scripts', function() {


    var tsResult = tsProject.src()
        .pipe(tsProject());


    return tsResult.js.pipe(gulp.dest(targetFolder));
});

gulp.task("watch", function() {
    runSequence("clean",  "scripts");
    gulp.watch(["src"], ["scripts"]);
});