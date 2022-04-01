const gulp = require("gulp");
const del = require("del");
const terser = require("gulp-terser");
const postcss = require("gulp-postcss");
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const babel = require("gulp-babel");
const data = require("gulp-data");
const cache = require("gulp-cached");
const sass = require("gulp-sass");
const flatmap = require("gulp-flatmap");
sass.compiler = require("node-sass");
const nunjucksRender = require("gulp-nunjucks-render");
const cssnano = require("cssnano");
const uncss = require("postcss-uncss");
const autoprefixer = require("autoprefixer");
var replace = require("gulp-replace");
const fs = require("fs");
const inject = require("gulp-inject");

// Load environment variable
require("dotenv").config();

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
        return {
          GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
          ...JSON.parse(fs.readFileSync(`${sourceFolder}/data/skillset.json`)),
          ...JSON.parse(fs.readFileSync(`${sourceFolder}/data/companies.json`)),
          ...JSON.parse(fs.readFileSync(`${sourceFolder}/data/timeline.json`)),
        };
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
    .pipe(cache("assets"))
    .pipe(imagemin([imagemin.mozjpeg({ quality: 50 })]))
    .pipe(gulp.dest(`${outputFolder}/assets`));
});

gulp.task("build:js", function () {
  return gulp
    .src([`${sourceFolder}/static/js/*.js`])
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(terser())
    .pipe(gulp.dest(`${outputFolder}/js`));
});

gulp.task("include:lazysizes", function () {
  return gulp
    .src([
      "node_modules/lazysizes/lazysizes.min.js",
      "node_modules/lazysizes/plugins/unveilhooks/ls.unveilhooks.min.js",
    ])
    .pipe(gulp.dest(`${outputFolder}/js`));
});

gulp.task("build:css", function () {
  return gulp
    .src(`${sourceFolder}/static/css/*.+(css|scss)`)
    .pipe(sass().on("error", sass.logError))
    .pipe(cache("css"))
    .pipe(
      flatmap(function (stream, file) {
        const subject = file.relative.replace(".css", "");
        const htmlFile =
          subject === "main" ? "index.html" : `${subject}/index.html`;

        return stream.pipe(
          postcss([
            uncss({
              htmlroot: outputFolder,
              html: [`${outputFolder}/${htmlFile}`],
              ignore: [/^(\.navbar-burger).*/, /^(\.navbar-menu).*/],
              timeout: 100,
            }),
            autoprefixer,
            cssnano,
          ])
        );
      })
    )
    .pipe(gulp.dest(`${outputFolder}/css`));
});

gulp.task("merge:css", function () {
  return gulp
    .src(`${outputFolder}/**/*.html`)
    .pipe(
      flatmap(function (stream, file) {
        const subject = file.relative
          .replace("index.html", "")
          .replace("/", "");
        const cssfile = subject === "" ? "main.css" : `${subject}.css`;
        return stream
          .pipe(inject(gulp.src(`${outputFolder}/css/${cssfile}`)))
          .pipe(
            replace(/<link rel="stylesheet" href="[^"]*"*>/g, function (
              linkTag
            ) {
              var style = fs.readFileSync(
                `.${getCSSFilename(linkTag)}`,
                "utf8"
              );
              return "<style>\n" + style + "\t</style>";
            })
          );
      })
    )
    .pipe(gulp.dest(outputFolder));
});

function getCSSFilename(linkTag) {
  var hrefValue = /href\=\"([A-Za-z0-9/._]*)\"/g;
  var cssFilename = linkTag.match(hrefValue);
  cssFilename = cssFilename[0].replace('href="', "").replace('"', "");
  return cssFilename;
}

gulp.task("minify:html", function () {
  return gulp
    .src(`${outputFolder}/**/*.html`)
    .pipe(
      htmlmin({
        collapseInlineTagWhitespace: true,
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        sortAttributes: true,
        sortClassName: true,
        removeComments: true,
        quoteCharacter: true,
        minifyURLs: true,
        minifyJS: true,
        minifyCSS: true,
      })
    )
    .pipe(gulp.dest(outputFolder));
});

gulp.task("deploy", function () {
  // write your script here to deploy app to your server
});

gulp.task(
  "build",
  gulp.series([
    "clean",
    "build:html",
    "build:js",
    "build:assets",
    "build:css",
    "merge:css",
    "include:lazysizes",
    "minify:html",
  ])
);

gulp.task("watch", function () {
  return gulp.watch(
    `${sourceFolder}/**`,
    gulp.series([
      "build:html",
      "build:js",
      "build:assets",
      "build:css",
      "merge:css",
      "include:lazysizes",
    ])
  );
});
