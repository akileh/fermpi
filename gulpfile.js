var gulp = require('gulp'),
    browserify = require('browserify'),
    _ = require('underscore'),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify'),
    watchify = require('watchify'),
    growl = require('growl'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    jshint = require('gulp-jshint'),
    minifyCss = require('gulp-minify-css'),
    stylish = require('jshint-stylish'),
    nodemon = require('gulp-nodemon')

gulp.task('dev', ['server', 'watchify'])

gulp.task('server', function () {
    // parse arguments to nodemon
    var argv = {}
    process.argv.forEach(function (arg) {
        var match = arg.match(/^--(.+)=(.+)/)
        if(match)
            argv[match[1]] = match[2]
    })

    nodemon({
        script: './app.js',
        ext: 'js hbs json',
        env: _.extend({
            NODE_ENV: 'development',
            port: 3000
        }, argv),
        watch: [
            './app.js',
            './back'
        ]
    })
})

gulp.task('watchify', function () {
    var bundler = watchify(browserify('./front/init.js', {
        cache: {},
        packageCache: {},
        fullPaths: true,
        insertGlobals: true,
        debug: true
    }))
    bundler.transform('hbsfy')
    bundler.on('update', rebundle)

    function rebundle () {
        console.log('rebundling')
        return bundler.bundle()
            .on('error', function (err) {
                console.error(err.stack)
                growl('error on watchify')
            })
            .pipe(source('fermpi.debug.js'))
            .pipe(gulp.dest('./public/dist/'))
            .pipe(livereload())
    }

    return rebundle()
})

gulp.task('browserify', function () {
    var bundler = browserify('./front/init.js', {
        insertGlobals: true
    })

    bundler.transform('hbsfy')
    return bundler.bundle()
        .pipe(source('fermpi.min.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('./public/dist'))
})

gulp.task('css', function () {
    return gulp.src([
           './bower_components/bootstrap/dist/css/bootstrap.css',
           './bower_components/bootstrap-datepicker/css/datepicker3.css',
           './bower_components/nvd3/nv.d3.css',
           './front/css/fermpi.css'
        ])
        .pipe(concat('fermpi.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./public/dist'))
})

gulp.task('jshint', function () {
    return gulp.src(['./app.js', './back/**/*.js', './front/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
})
