var gulp = require('gulp')
    sass = require('gulp-ruby-sass')
    minifycss = require('gulp-minify-css')
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    del = require('del');

gulp.task('styles', function() {
  return gulp.src('listeningto/static/sass/**/*.sass')
    .pipe(sass({ style: 'expanded' }))
    .pipe(gulp.dest('listeningto/static/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('listeningto/static/css'))
    .pipe(livereload())
    .pipe(notify({ message: 'completed styles task.' }));
});

gulp.task('scripts', function() {
  return gulp.src('listeningto/static/scripts/**/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('listeningto/static/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('listeningto/static/js'))
    .pipe(livereload())
    .pipe(notify({ message: 'completed scripts task.' }));
});

// HTML
gulp.task('html', function() {
  return gulp.src(['template/**/*.html'])
  .pipe(livereload());
});

gulp.task('clean', function(cb) {
    del(['listeningto/static/js', 'listeningto/static/css'], cb)
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts');
});

gulp.task('watch', function() {

  // create livereload server
  livereload.listen();

  // watch sass files for changes
  gulp.watch('listeningto/static/sass/**/*.sass', ['styles']);
  // watch js files for changes
  gulp.watch('listeningto/static/scripts/**/*.js', ['scripts']);
  gulp.watch('templates/**/*.html', ['html']);

  // // watch any files in dist, reload changes
  // gulp.watch(['listeningto/static/js', 'listeningto/static/css']).on('change', livereload.changed);

});
