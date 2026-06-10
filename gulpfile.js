'use strict';

const gulp = require('gulp');
const sassGlob = require('gulp-sass-glob');
const plumber = require('gulp-plumber');
const rename = require("gulp-rename");
const browsersync = require('browser-sync').create();
const sass = require('gulp-dart-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// nastavení
const settings = {
  browsersync: {
    baseDir: './', // Hlavní složka projektu, kde leží tvůj index.html
    watch: ['*.html', '**/*.html', 'assets/js/**/*.js'] // Sledujeme HTML i JS soubory
  },
  css: {
    source: 'scss/screen.scss',
    target: 'assets/css/',
    filename: 'screen.min.css',
    watch: ['scss/**/*.scss', 'scss/**/*.css', 'scss/screen.scss']
  }
};

// výpis chybových hlášek
const onError = function (err) {
  console.log(err.message);
  this.emit('end');
};

// SASS kompilace
function makecss() {
  return gulp.src(settings.css.source)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sassGlob())
    .pipe(sass({ 
      style: 'expanded',
      silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions']
    }))
    .pipe(postcss([
      autoprefixer({ overrideBrowserslist: ['last 2 versions', 'ios >= 7', 'android >= 4.4'] }),
      cssnano()
    ]))
    .pipe(rename(settings.css.filename))
    .pipe(gulp.dest(settings.css.target))
    .pipe(browsersync.stream()); // injectuje CSS bez celkového refreshe
}

// Inicializace BrowserSync (funguje jako statický server)
function browserSyncInit(done) {
  browsersync.init({
    server: {
      baseDir: settings.browsersync.baseDir
    },
    open: true, // automaticky otevře prohlížeč
    notify: false // schová ten malý popup "Connected to BrowserSync" v pravém horním rohu
  });
  done();
}

// BrowserSync live-reload pro HTML soubory
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// sledování změn souborů
function watchFiles() {
  gulp.watch(settings.css.watch, makecss);
  gulp.watch(settings.browsersync.watch, browserSyncReload);
}

// Exporty tasků (Gulp 4 syntaxe)
const watch = gulp.series(makecss, browserSyncInit, watchFiles);

exports.makecss = makecss;
exports.watch = watch;
exports.default = watch;