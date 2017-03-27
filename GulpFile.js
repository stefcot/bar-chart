var gulp                = require('gulp'),
    sass                = require('gulp-sass'),
    sourcemaps          = require('gulp-sourcemaps'),
    prefix              = require('gulp-autoprefixer'),
    concat              = require('gulp-concat-sourcemap'),
    minify              = require('gulp-minify'),
    minifyCss           = require('gulp-minify-css'),
    uglify              = require('gulp-uglifyjs'),
    rename              = require("gulp-rename"),
    clean               = require('gulp-clean'),
    watch               = require('gulp-watch'),
    runSequence         = require('gulp-run-sequence'),
    webserver           = require('gulp-webserver'),
    browserSync         = require('browser-sync').create(),
    reload              = browserSync.reload,
    historyApiFallback  = require('connect-history-api-fallback'),
    favicon             = require('serve-favicon'),
    header              = require('gulp-header'),
    path                = require('path'),
    pkg                 = require('./package.json');

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
            ' * Copyright <%= new Date().getFullYear() %>, <%= pkg.author.name %> for Fifty-Five\n' +
            '*/\n\n';
}

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
 * Needs middleware listing to handle path refresh.
 *
 * @see https://www.npmjs.com/package/gulp-webserver
 */
gulp.task('webserver', function() {
    gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: true,
            path: '/',
            port: 80,
            middleware: [historyApiFallback(), favicon(path.join(__dirname, 'dist', 'favicon.ico'))]
        }));
});

/**
 * Simple web server with live reload ability for nice testing and design.
 * Needs middleware listing to handle path refresh.
 *
 * @see https://www.browsersync.io/docs/gulp
 */
gulp.task('browsersync', function() {
    browserSync.init({
        server: './dist',
        notify: false,
        port: 80,
        open: "local",
        //browser: ['chrome', 'firefox', 'iexplore', 'safari', 'opera'],
        middleware: [historyApiFallback(), favicon(path.join(__dirname, 'dist', 'favicon.ico'))]
    });
});

/**
 * Copies Sass math functions
 *
 * @see https://www.npmjs.com/package/mathsass
 */
gulp.task('mathsass:copy', function() {
    return gulp.src('./node_modules/mathsass/dist/**/*')
        .pipe(gulp.dest('./src/scss/mathsass'));
});

/**
 * Copies compass-mixins installed with NPM to src directory on project install.
 * Here's a simple way to take full advantage of compass environment i.e its mixins,
 * without any hassle, no need to install gulp-compass or some kind of.
 */
gulp.task('compass:copy', function() {
    return gulp.src('./node_modules/compass-mixins/lib/**/*')
        .pipe(gulp.dest('./src/scss/compass-mixins/lib'));
});

/**
 * Copies normalize.css reset file
 *
 * @see https://github.com/necolas/normalize.css/
 */
gulp.task('normalize:copy', function() {
    return gulp.src('./node_modules/normalize.css/normalize.css')
        .pipe(rename('_normalize.scss'))
        .pipe(gulp.dest('./src/scss/partials'));
});

/**
 * Copies src/fonts directory and its contents to dist directory
 */
gulp.task('fonts:copy', function() {
    return gulp.src(['./src/fonts/**/*'], {
        base: 'src'
    }).pipe(gulp.dest('./dist'));
});

/**
 * Copies templates directory and its contents to dist directory
 */
gulp.task('templates:copy', function() {
    return gulp.src(['./src/templates/*'], {
        base: 'src'
    }).pipe(gulp.dest('./dist'));
});

/**
 * Copies all polyfills listed to dist directory (extensible)
 */
gulp.task('polyfills:copy', function() {
    return gulp.src(['./node_modules/custom-event-polyfill/custom-event-polyfill.js',
        './node_modules/json3/lib/json3.js',
        './node_modules/bluebird/js/browser/bluebird.js'])
        .pipe(gulp.dest('./src/js/polyfills'));
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
    return gulp.src(['./src/js/**/*.js'])
        .pipe(concat('index.js', {
            sourcesContent : true,
            sourceRoot  : '',
            prefix  : 'stefcot-',
            sourceMappingBaseURL  : true
        }))
        .pipe(minify())
        // .pipe(uglify('index.js', {
        //     outSourceMap: true
        // }))
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
 * Simple copy of templates files to dist directory on file change.
 */
gulp.task('templates:build', function() {
    return gulp.src('./src/templates/**/*')
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
        // Browsersync solution
        reload();
    });

    watch('./src/js/**/*.js', {usePolling: true}, function(vinyl) {
        console.log('File ' + vinyl.path + ' was "' + vinyl.event + '", running tasks...');
        gulp.start('js:build');
        // Browsersync solution
        reload();
    });

    watch('./src/html/**/*', {usePolling: true}, function(vinyl) {
        console.log('File ' + vinyl.path + ' was "' + vinyl.event + '", running tasks...');
        gulp.start('html:build');
        // Browsersync solution
        reload();
    });

    watch('./src/templates/**/*', {usePolling: true}, function(vinyl) {
        console.log('File ' + vinyl.path + ' was "' + vinyl.event + '", running tasks...');
        gulp.start('templates:build');
        // Browsersync solution
        reload();
    });
});

/**
 * Tasks called on project install when developer executes 'npm install' script,
 * fetches compass environment and JS front dependencies first.
 */
gulp.task('install', function() {
    runSequence('compass:copy', 'mathsass:copy', 'normalize:copy', 'polyfills:copy', 'build');
});

/**
 * Default gulp tasks, preparing dist directory, building contents
 * and places them all in the dist directory, afterwards launching a live reload web server,
 * finally initiating the watch process, ready to go!
 */
gulp.task('build', function() {
    runSequence('clean', ['sass:build', 'js:build', 'html:build'], 'templates:copy', 'fonts:copy', 'browsersync', 'watch');
});

/**
 * Main call to gulp tasks
 */
gulp.task('default', ['build']);