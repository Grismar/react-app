// generic
gulp = require('gulp');
merge = require('merge2');
// js
eslint = require('gulp-eslint');
newer = require('gulp-newer');
sourcemaps = require('gulp-sourcemaps');
source_stream = require('vinyl-source-stream');
buffer = require('vinyl-buffer');
browserify = require('browserify');
watchify = require('watchify');
babelify = require('babelify');
util = require('gulp-util');
// css
sass = require('gulp-sass');
autoprefixer = require('gulp-autoprefixer');
postcss = require('gulp-postcss');
csswring = require('csswring');
concat = require('gulp-concat');
// html
htmlreplace = require('gulp-html-replace');

source = {
    npm_vendor: [
        'node_modules/react/dist/react.js',
        'node_modules/react-dom/dist/react-dom.js'
    ],
    vendor: [
        'assets/vendor/js/react.js',
        'assets/vendor/js/react-dom.js'
    ],
    project: [
        'assets/js/*.js',
        'assets/components/*.jsx',
        '!assets/js/*-compiled.js'
    ],
    index: 'assets/js/index.js'
};

style = {
    vendor: [
        'assets/vendor/css/*.css'
    ],
    project: [
        'assets/css/*.scss'
    ]
};

gulp.task('eslint', function() {
    return gulp.src(source.project)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
});

gulp.task('copy-npm-vendor', function() {
    return gulp.src(source.npm_vendor)
        .pipe(newer('assets/vendor/js'))
        .pipe(gulp.dest('assets/vendor/js'))
});

function compile(watch) {
    bundler = browserify(source.index, { debug: true }).transform(babelify);

    bundler.on('log', util.log);

    function rebundle() {
        bundler.bundle()
            .on('error', function(err) { console.error(err); this.emit('end'); })
            .pipe(source_stream('app.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist/js'));
    }

    if (watch) {
        watchify(bundler).on('update', function() {
            console.log('-> bundling...');
            rebundle();
        });
    }

    rebundle();
}

gulp.task('build-js', ['eslint', 'copy-npm-vendor'], function() {
    return compile(false)
});

gulp.task('watch-js', ['eslint', 'copy-npm-vendor'], function() {
    return compile(true)
});

gulp.task('build-css', function(){
    return merge(
        gulp.src(style.vendor)
            .pipe(sourcemaps.init()),
        gulp.src(style.project)
            .pipe(sourcemaps.init())
            .pipe(sass())
        )
        .pipe(postcss([csswring]))
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('copy-files', function() {
    return merge(
        gulp.src('assets/files/**/*.html')
            .pipe(htmlreplace({
                'css': 'css/styles.css',
                'js': 'js/app.js'
            }))
            .pipe(gulp.dest('dist')),
        gulp.src(['assets/files/**/*', '!assets/files/**/*.html'])
            .pipe(gulp.dest('dist'))
    )
});

gulp.task('default', ['build-js', 'build-css', 'copy-files']);
