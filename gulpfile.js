const { spawn } = require("child_process");
const path = require("path");
const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const gulpSequence = require("gulp-sequence");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnext = require("cssnext");
const precss = require("precss");
const babel = require("gulp-babel");
const browserSync = require("browser-sync").create("Server");
const image = require("gulp-image");

gulp.task("static", function () {
  return gulp.src("./src/copy/**/*").pipe(gulp.dest("./dist"));
});

gulp.task("css", function () {
  const processors = [
    autoprefixer({
      browsers: ["last 15 version"],
    }),
    cssnext,
    precss,
  ];
  return (
    gulp
      .src("./src/scss/**/*.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss(processors))
      // .pipe(minifyCSS())
      .pipe(gulp.dest("dist/static/css"))
  );
});

gulp.task("images", function () {
  return gulp
    .src(["src/img/*.*"])
    .pipe(image())
    .pipe(gulp.dest("dist/static/img"));
});
gulp.task("fonts", function () {
  return gulp
    .src(["src/fonts/*.*"])
    .pipe(image())
    .pipe(gulp.dest("dist/static/fonts"));
});

function reloadBrowserMsg() {
  browserSync.reload();
  browserSync.resume();
}

gulp.task("static-watch", ["static"], function (done) {
  reloadBrowserMsg();
  done();
});

gulp.task("css-watch", ["css"], function (done) {
  reloadBrowserMsg();
  done();
});

gulp.task("images-watch", ["images"], function (done) {
  reloadBrowserMsg();
  done();
});
gulp.task("fonts-watch", ["fonts"], function (done) {
  reloadBrowserMsg();
  done();
});

// Static server
gulp.task("browser-sync", function () {
  browserSync.init({
    server: {
      baseDir: "./",
      open: true,
      browser: "google chrome",
    },
  });
});

gulp.task(
  "dist",
  gulpSequence("css", "images", "fonts", "static", "browser-sync")
);
gulp.task("devel", ["dist"], function () {
  gulp.watch("./src/copy/**/*", ["static-watch"]);
  gulp.watch("./src/scss/**/*.scss", ["css-watch"]);
  gulp.watch("./src/img/*.*", ["images-watch"]);
  gulp.watch("./src/fonts/*.*", ["fonts-watch"]);
});
gulp.task("default", ["devel"]);
