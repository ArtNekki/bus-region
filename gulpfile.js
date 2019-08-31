var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    cssshrink = require('gulp-cssshrink'),
    cp = require('child_process'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    size = require('gulp-size'),
    ghPages = require('gulp-gh-pages');
    svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace');


gulp.task('styles', function() {
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(rename({suffix: '.min'}))
    //.pipe(minifycss())
    //.pipe(cssshrink())
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts', function() {
  return gulp.src(['./src/javascripts/**/*.js'])
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(plumber())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('public/javascripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/javascripts'))
    .pipe(browserSync.reload({stream:true}));
});

// Optimizes the images that exists
gulp.task('images', function () {
  return gulp.src('src/images/content/**')
    .pipe(changed('public/images/content'))
    .pipe(imagemin({
      // Lossless conversion to progressive JPGs
      progressive: true,
      // Interlace GIFs for progressive rendering
      interlaced: true
    }))
    .pipe(gulp.dest('public/images/content'))
    .pipe(size({title: 'images'}));
});

gulp.task('html', function() {
  gulp.src('./src/**/*.html')
    .pipe(gulp.dest('public/'))
});

gulp.task('svg', () => {
  const svgPath = {
        'input': './src/images/svg/*.svg',
        'output': './public/images/svg/'
    };

    return gulp.src(svgPath.input)
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                // $('[fill]').removeAttr('fill');
                // $('[stroke]').removeAttr('stroke');
                // $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest(svgPath.output));
});

gulp.task('fonts', () => {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('./public/fonts/'));
});

gulp.task('browser-sync', ['styles', 'scripts', 'svg', 'fonts'], function() {
  browserSync({
    server: {
      baseDir: "./public/",
      injectChanges: true // this is new
    }
  });
});

gulp.task('deploy', function() {
  return gulp.src('./public/**/*')
    .pipe(ghPages());
});

gulp.task('watch', function() {
  // Watch .html files
  gulp.watch('src/**/*.html', ['html', browserSync.reload]);
  gulp.watch("public/*.html").on('change', browserSync.reload);
  // Watch .sass files
  gulp.watch('src/sass/**/*.scss', ['styles', browserSync.reload]);
  // Watch fonts files
  gulp.watch('src/fonts/**/*', ['fonts', browserSync.reload]);
  // Watch svg-icons
  gulp.watch('src/images/svg/*.svg', ['svg', browserSync.reload]);
  // Watch .js files
  gulp.watch('src/javascripts/*.js', ['scripts', browserSync.reload]);
  // Watch image files
  gulp.watch('src/images/**/*', ['images', browserSync.reload]);
});

gulp.task('default', function() {
    gulp.start('styles', 'scripts', 'images', 'svg', 'fonts', 'html', 'browser-sync', 'watch');
});
