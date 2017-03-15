var gulp         = require('gulp'),
    bower        = require('gulp-bower'),
    sass         = require('gulp-sass'),
    uglify       = require('gulp-uglifyjs'),
    minifyCss    = require('gulp-minify-css'),
    sourcemaps   = require('gulp-sourcemaps'),
    prefix       = require('gulp-autoprefixer'),
    rename       = require("gulp-rename"),
    clean        = require('gulp-clean'),
    watch        = require('gulp-watch'),
    runSequence  = require('gulp-run-sequence'),
    webserver    = require('gulp-webserver'),
    header       = require('gulp-header'),
    pkg          = require('./package.json');

/**
 * Return a header template for CSS and JS generated files
 *
 * @see https://www.npmjs.com/package/gulp-header
 */
function getHeaderTemplate() {
    return  '/**\n' +
            ' * <%= pkg.name %> - <%= pkg.description %>\n' +
            ' * @version <%= pkg.version %>\n' +
            ' *\n' +
            ' * @link <%= pkg.homepage %>\n' +
            ' * @license <%= pkg.license %> license.\n' +
            ' * \n' +
            ' * Last modified <%= new Date().toISOString() %>\n' +
            ' * Copyright <%= new Date().getYear() %>, Fifty-Five, <%= pkg.author %>\n' +
            '*/\n\n';
}

/**
 * Fetches all extra JS front dependencies on project install.
 *
 * @see https://www.npmjs.com/package/gulp-bower
 */
gulp.task('bower', function() {
    return bower('./bower_components');
});

/**
 * Empties dist directory, used on project install.
 *
 * @see https://www.npmjs.com/package/gulp-clean
 */
gulp.task('clean', function() {
    return gulp.src('./dist').pipe(clean());
});

/**
 * Simple web server with live reload ability for nice testing and design.
 *
 * @see https://www.npmjs.com/package/gulp-webserver
 */
gulp.task('webserver', function() {
    gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: true
        }));
});

/**
 * Copies compass-mixins installed with NPM to src directory on project install.
 * Here's a simple way to take full advantage of compass environment i.e its mixins,
 * without any hassle, no need to install gulp-compass or some kind of.
 */
gulp.task('compass:copy', function() {
    return gulp.src('./node_modules/compass-mixins/lib/**/*')
        .pipe(gulp.dest('./src/scss/lib'));
});

/**
 * Compiles SASS files and sends the result to dist directory,
 * applies some browser prefixes for compatibility, minifies the CSS file,
 * generates some source map file infos for nice and easy debugging.
 *
 * @see https://www.npmjs.com/package/gulp-sass
 * @see https://www.npmjs.com/package/gulp-autoprefixer
 * @see https://www.npmjs.com/package/gulp-minify-css
 * @see https://www.npmjs.com/package/gulp-clean-css
 * @see https://www.npmjs.com/package/gulp-rename
 */
gulp.task('sass:build', function () {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass()
            .on('error', sass.logError))
        .pipe(prefix("last 2 version", "> 1%", "ie 9", "ie 8"))
        .pipe(sourcemaps.init())
        .pipe(minifyCss())
        .pipe(rename('main.min.css'))
        .pipe(header(getHeaderTemplate(), { pkg : pkg } ))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css'));
});

/**
 * Concats, minifies JS files and sends the resulting file
 * to the dist directory.
 *
 * @see https://www.npmjs.com/package/gulp-uglifyjs
 */
gulp.task('js:build', function() {
    return gulp.src(['./src/js/*.js', 'bower_components/**/*.js'])
        .pipe(uglify('index.js', {
            outSourceMap: true
        }))
        .pipe(header(getHeaderTemplate(), { pkg : pkg } ))
        .pipe(gulp.dest('./dist/js'));
});

/**
 * Simple copy of front files to dist directory on file change.
 */
gulp.task('html:build', function() {
    return gulp.src('./src/html/**/*')
        .pipe(gulp.dest('./dist'));
});

/**
 * Watch process calling the proper tasks, using gulp-watch which
 * I find much more reliable than the basic gulp method.
 *
 * @see https://www.npmjs.com/package/gulp-watch
 */
gulp.task('watch', function() {

    watch('./src/scss/**/*.scss', {usePolling: true}, function(vinyl) {
        console.log('File ' + vinyl.path + ' was "' + vinyl.event + '", running tasks...');
        gulp.start('sass:build');
    });

    watch('./src/js/**/*.js', {usePolling: true}, function(vinyl) {
        console.log('File ' + vinyl.path + ' was "' + vinyl.event + '", running tasks...');
        gulp.start('js:build');
    });

    watch('./src/html/**/*', {usePolling: true}, function(vinyl) {
        console.log('File ' + vinyl.path + ' was "' + vinyl.event + '", running tasks...');
        gulp.start('html:build');
    });
});

/**
 * Tasks called on project install when developer executes 'npm install' script,
 * fetches JS front dependencies and compass environment first.
 */
gulp.task('install', function() {
    runSequence('bower', 'compass:copy', 'build');
});

/**
 * Default gulp tasks, preparing dist directory, building contents
 * and places them all in the dist directory, afterwards launching a live reload web server,
 * finally initiating the watch process, ready to go!
 */
gulp.task('build', function() {
    runSequence('clean', ['sass:build', 'js:build', 'html:build'], 'webserver', 'watch');
});

/**
 * Guess what ....
 */
gulp.task('default', ['build']);