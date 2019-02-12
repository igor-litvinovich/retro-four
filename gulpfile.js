var gulp = require('gulp');
var del = require('del');
var inject = require('gulp-inject');
var webserver = require('gulp-webserver');
var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var concatCss = require('gulp-concat-css');

var paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcCSS: 'src/css/main.css',
    srcJS: 'src/**/*.js',
    srcAssets: 'src/assets/**/*.*',

    tmp: 'tmp',
    tmpIndex: 'tmp/index.html',
    tmpCSS: 'tmp/**/*.css',
    tmpJS: 'tmp/**/*.js',
    tmpCssVendors: 'tmp/css/',
    tmpAssets: 'tmp/assets/',

    dist: 'dist',
    distIndex: 'dist/index.html',
    distCSS: 'dist/**/*.css',
    distJS: 'dist/**/*.js',
    distCssVendors: 'dist/css/',
    distAssets: 'dist/assets/',

    cssVendors: 'src/css/vendors/*.css'
};

/**
 * DEVELOPMENT
 */
gulp.task('html', function () {
    return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});

gulp.task('cssVendors', function () {
    return gulp.src([paths.cssVendors])
        .pipe(gulp.dest(paths.tmpCssVendors));
});

gulp.task('css', function () {
    return gulp.src(paths.srcCSS)
        .pipe(concatCss('css/style.css'))
        .pipe(gulp.dest(paths.tmp));
});
gulp.task('js', function () {
    return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});

gulp.task('assets', function () {
    return gulp.src(paths.srcAssets).pipe(gulp.dest(paths.tmpAssets));
});

gulp.task('copy', ['html', 'css', 'js', 'assets']);

gulp.task('inject', ['copy'], function () {
    var css = gulp.src(paths.tmpCSS);
    var js = gulp.src(paths.tmpJS);
    return gulp.src(paths.tmpIndex)
        .pipe(inject(css, { relative: true }))
        .pipe(inject(js, { relative: true }))
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('serve', ['inject'], function () {
    return gulp.src(paths.tmp)
        .pipe(webserver({
            port: 8000,
            livereload: true
        }));
});

gulp.task('watch', ['serve'], function () {
    gulp.watch(paths.src, ['inject']);
});

gulp.task('default', ['clean', 'watch']);
/**
 * DEVELOPMENT END
 */


/**
 * PRODUCTION
 */
gulp.task('html:dist', function () {
    return gulp.src(paths.srcHTML)
        .pipe(htmlclean())
        .pipe(gulp.dest(paths.dist));
});


gulp.task('assets:dist', function () {
    return gulp.src(paths.srcAssets).pipe(gulp.dest(paths.tmpAssets));
});

gulp.task('css:dist', function () {
    return gulp.src(paths.srcCSS)
        .pipe(concatCss('css/style.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.dist));
});
gulp.task('cssVendors:dist', function () {
    return gulp.src(paths.cssVendors)
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.distCssVendors));
});

gulp.task('js:dist', function () {
    return gulp.src(paths.srcJS)
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist));
});
gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist', 'assets:dist']);
gulp.task('inject:dist', ['copy:dist'], function () {
    var css = gulp.src(paths.distCSS);
    var js = gulp.src(paths.distJS);
    return gulp.src(paths.distIndex)
        .pipe(inject(css, { relative: true }))
        .pipe(inject(js, { relative: true }))
        .pipe(gulp.dest(paths.dist));
});
gulp.task('build', ['clean', 'inject:dist']);
/**
 * PRODUCTION END
 */

gulp.task('clean', function () {
    del([paths.tmp, paths.dist]);
});

