var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    webpack = require('webpack-stream'),
    paths = {
      sass: ['scss/**/*.scss'],
      scripts: ['src/**/*.js']
    };


gulp.task('styles', function() {
  'use strict';
  return gulp.src(paths.sass)
    .pipe(compass({
      config_file: 'config.rb',
      css: 'stylesheets',
      sass: 'scss'
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: [
        'last 2 version',
        'ie 6-8',
        'Firefox > 20'
      ],
      grid: true, //'autoplace',
      cascade: false
    }))
    .pipe(gulp.dest('stylesheets'));
});

gulp.task('scripts', function () {
  'use strict';
  return gulp.src(paths.scripts)
  .pipe(webpack( require('./webpack.config.js') ))
  .pipe(gulp.dest('js'));
});

gulp.task('watch', function(){
  'use strict';
  gulp.watch(paths.sass, ['styles']);
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['styles', 'scripts']);
