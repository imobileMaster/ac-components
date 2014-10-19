var gulp = require('gulp'),
    karma = require('karma').server,
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    ngAnnotate = require('gulp-ng-annotate'),
    sourceFiles = [
      'src/acComponents/acComponents.prefix',
      'src/acComponents/acComponents.js',
      'src/acComponents/directives/**/*.js',
      'src/acComponents/filters/**/*.js',
      'src/acComponents/services/**/*.js',
      'src/acComponents/acComponents.suffix'
    ];

gulp.task('build', function() {
  gulp.src(sourceFiles)
    .pipe(concat('ac-components.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify())
    .pipe(rename('ac-components.min.js'))
    .pipe(gulp.dest('./dist'))
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma-src.conf.js',
    singleRun: true
  }, done);
});

gulp.task('test-debug', function (done) {
  karma.start({
    configFile: __dirname + '/karma-src.conf.js',
    singleRun: false,
    autoWatch: true
  }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-concatenated', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-concatenated.conf.js',
    singleRun: true
  }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-minified', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-minified.conf.js',
    singleRun: true
  }, done);
});

gulp.task('default', ['test', 'build']);
gulp.task('dist', ['test','test-dist-concatenated', 'test-dist-minified']);
