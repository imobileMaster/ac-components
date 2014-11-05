var gulp = require('gulp');
var karma = require('karma').server;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var webserver = require('gulp-webserver');
var templateCache = require('gulp-angular-templatecache');
var jade = require('gulp-jade');
var fs = require('fs');
var awspublish = require('gulp-awspublish');
var sourceFiles = [
    'src/acComponents/acComponents.prefix',
    'src/acComponents/acComponents.js',
    'src/acComponents/directives/**/*.js',
    'src/acComponents/filters/**/*.js',
    'src/acComponents/services/**/*.js',
    'src/acComponents/templates/**/*.js',
    'src/acComponents/acComponents.suffix'
];

gulp.task('example', function() {
    gulp.src('.')
        .pipe(webserver({
          livereload: true,
          directoryListing: true
        }));
});

gulp.task('templates', function () {
    gulp.src('src/acComponents/templates/*.jade')
        .pipe(jade())
        .pipe(templateCache({
            module: 'acComponents.templates',
            standalone: true
        }))
        .pipe(gulp.dest('src/acComponents/templates/'));
});

gulp.task('build', function() {
    gulp.src(sourceFiles)
        .pipe(concat('ac-components.js'))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename('ac-components.min.js'))
        .pipe(gulp.dest('./dist'))
});

gulp.task('example:copy', function () {
    var deps = {
        css: [
            './bower/mapbox.js/mapbox.css',
            './bower/Leaflet.label/dist/leaflet.label.css',
            './bower/leaflet.locatecontrol/src/L.Control.Locate.css'
        ],
        js: [
            './bower/lodash/dist/lodash.min.js',
            './bower/jquery/dist/jquery.min.js',
            './bower/angular/angular.min.js',
            './bower/angular-sanitize/angular-sanitize.min.js',
            './bower/mapbox.js/mapbox.js',
            './bower/Leaflet.label/dist/leaflet.label.js',
            './bower/leaflet.locatecontrol/src/L.Control.Locate.js'
        ]
    };

    for (var dep in deps) {
        gulp.src(deps[dep])
            .pipe(concat('vendor.'+dep))
            .pipe(gulp.dest('./example/'+dep));
    }

    gulp.src('./bower/mapbox.js/images/*.png')
        .pipe(gulp.dest('./example/css/images'));

    gulp.src('./dist/ac-components.js')
        .pipe(gulp.dest('./example/js'));
});

// requires aws-credentials.json in root project or will default to using std AWS ENV_VARS
// { key: '...',  secret: '...', bucket: '...' }
gulp.task('example:publish', function () {
    var aws;
    var publisher;

    fs.exists(__dirname + '/aws-credentials.json', function (exists) {
        if(exists) {
            aws = require('./aws-credentials.json');
        } else {
            aws = {
                key: process.env.AWS_ACCESS_KEY_ID,
                secret: process.env.AWS_SECRET_KEY,
                bucket: 'ac-components-example',
                region: 'us-west-2'
            };
        }

        publisher = awspublish.create(aws);

        return gulp.src('./example/**/*')
            .pipe(publisher.publish())
            .pipe(awspublish.reporter());
    });
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

gulp.task('watch', function () {
    gulp.watch('./src/acComponents/**/*.js', ['build', 'example:copy']);
    gulp.watch('./src/acComponents/templates/*.jade', ['templates', 'example:copy']);
});

gulp.task('dev', ['build', 'templates', 'watch', 'example']);
gulp.task('default', ['test', 'build']);
gulp.task('dist', ['test','test-dist-concatenated', 'test-dist-minified']);
