const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
//const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const cssmin = require('gulp-cssmin');
const gcmq = require('gulp-group-css-media-queries');
//const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const babel = require('gulp-babel');


/* ------------ CLEAR ------------- */
function clear() {
  return del('build');
}

/* ------------ WATCH------------- */
function watch() {
  browserSync.init({
    server: {
      baseDir: "build"
    }
  });

  gulp.watch('source/styles/**/*', styles);
  gulp.watch('source/template/**/*', html);
  gulp.watch('source/js/**/*', js);
}

/* ------------ HTML------------- */
function html() {
  return gulp.src('source/template/pages/*')
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.stream());
}

/* ------------ STYLES ------------- */
function styles() {
  return gulp.src('source/styles/*.scss')
    //.pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gcmq())
    .pipe(cssmin())
    .pipe(rename(function (path) {
      path.basename += ".min";
    }))
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
}

/* ------------ IMAGES ------------- */
function images() {
  return gulp.src('source/images/**/*')
    .pipe(gulp.dest('build/images/'));
}

/* ------------ JS ------------- */
function js() {
  return gulp.src('source/js/*.js')
    .pipe(babel({ presets: ['@babel/env']}))
    .pipe(gulp.dest('build/js/'));
}

/* ------------ COPY JS PLUGIN------------- */
function copyJsPlugins() {
  return gulp.src([
    'source/js/vendor/*.js',
  ])
    .pipe(gulp.dest('build/js/vendor'));
}

/* ------------ COPY FONTS ------------- */
function copyFonts() {
  return gulp.src('source/fonts/**/*',)
    .pipe(gulp.dest('build/fonts'));
}

/* ------------ BUILD SCRIPTS------------- */
let build = gulp.series(clear,
  gulp.parallel(html, styles, images, js, copyJsPlugins, copyFonts)
);

gulp.task('build', build);
gulp.task('default', gulp.series(build, watch));
