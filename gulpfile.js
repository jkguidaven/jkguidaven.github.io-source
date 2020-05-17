const gulp = require("gulp");
const del = require("del");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const postcss = require("gulp-postcss");
const data = require("gulp-data");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const nunjucksRender = require("gulp-nunjucks-render");
const cssnano = require("cssnano");
const uncss = require("postcss-uncss");
const autoprefixer = require("autoprefixer");
var fs = require("fs");

const sourceFolder = "source";
const outputFolder = "dest";

gulp.task("clean", function () {
  return del(`${outputFolder}/**`, { force: true });
});

gulp.task("build:html", function () {
  return gulp
    .src(`${sourceFolder}/pages/**/*.+(html|nunjucks|njk)`)
    .pipe(
      data(function () {
        return JSON.parse(
          fs.readFileSync(`${sourceFolder}/data/skillset.json`)
        );
      })
    )
    .pipe(
      nunjucksRender({
        path: [`${sourceFolder}/templates`],
      })
    )
    .pipe(gulp.dest(outputFolder));
});

gulp.task("build:assets", function () {
  return gulp
    .src([`${sourceFolder}/static/assets/**`])
    .pipe(gulp.dest(`${outputFolder}/assets`));
});

gulp.task("build:js", function () {
  return gulp
    .src([
      `${sourceFolder}/static/js/vendor/*.js`,
      `${sourceFolder}/static/js/main.js`,
    ])
    .pipe(concat("js/bundle.js"))
    .pipe(terser())
    .pipe(gulp.dest(outputFolder));
});

gulp.task("build:css", function () {
  return gulp
    .src(`${sourceFolder}/static/css/**.+(css|scss)`)
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("css/styles.css"))
    .pipe(
      postcss([
        uncss({
          html: [`${outputFolder}/*.html`],
          timeout: 100,
        }),
        autoprefixer,
        cssnano,
      ])
    )
    .pipe(gulp.dest(outputFolder));
});

gulp.task("deploy", function () {
  // write your script here to deploy app to your server
});

gulp.task(
  "build",
  gulp.series(["clean", "build:html", "build:js", "build:assets", "build:css"])
);

gulp.task("watch", function () {
  return gulp.watch(`${sourceFolder}/**`, gulp.series(["build"]));
});
