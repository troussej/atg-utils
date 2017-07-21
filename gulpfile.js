"use strict";
const gulp = require("gulp");
const del = require("del");
const ts = require('gulp-typescript');
const runSequence = require("run-sequence");
const tsProject = ts.createProject('tsconfig.json');

const _ = require('lodash');
const mustache = require("gulp-mustache");
const rename = require("gulp-rename");
const chmod = require('gulp-chmod');

const targetFolder = 'dist';



gulp.task("clean", function(done) {
    return del([targetFolder], done);
});

gulp.task('scripts', function() {


    var tsResult = tsProject.src()
        .pipe(tsProject());


    return tsResult.js.pipe(gulp.dest(targetFolder));
});

gulp.task('templates',function(){
    gulp.src('./src/templates/**/*.mustache')
    .pipe(gulp.dest('./dist/templates'))
})

gulp.task('bin', function() {

    const binConfig = require('./dist/commands')

    _.forEach(binConfig.commands, (cmdCfg) => {
        gulp.src("./build/atg-subcommand.mustache")
            .pipe(mustache(cmdCfg))
            .pipe(rename(function(path) {
                path.basename = "atg-" + cmdCfg.name;
                path.extname = ""
            }))
            .pipe(chmod(0o755))
            .pipe(gulp.dest("./dist/bin/"));
    })
    gulp.src("./build/atg.mustache")
        .pipe(mustache(binConfig))
        .pipe(rename(function(path) {
            path.extname = ""
        }))
        .pipe(chmod(0o755))
        .pipe(gulp.dest("./dist/bin/"));

})

gulp.task("watch", function() {
    runSequence("clean", "scripts");
    gulp.watch(["./src"], ["scripts"]);
});

gulp.task("default", function(done) {
    runSequence("clean", "scripts", "templates","bin", done);
});