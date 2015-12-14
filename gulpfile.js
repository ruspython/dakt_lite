var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    obfuscate = require('gulp-obfuscate'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    del = require('del'),
    fs = require('fs'),
    merge = require('merge-stream'),
    path = require('path'),

    dakty = require('./gulp-dakty'),
    daktConfig = require('./dakty-conf.json')
    ;

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

gulp.task('dakt', function () {
    var srcPath = [__dirname, 'src/'].join('/'),
        destPath = [__dirname, 'dist/'].join('/')
        ;
    dakty(srcPath, destPath, daktConfig).then(function () {
        //TODO: replace this dirty hack
        setTimeout(function () {
            gulp.start('build')
        }, 1000)
    });
});

gulp.task('fullfillSites', function () {
    var destPath = [__dirname, 'dist/'].join('/'),
        folders,
        dest,
        tasks
        ;
    folders = getFolders(destPath);
    tasks = folders.map(function (folder) {
        dest = 'dist/' + folder;
        return gulp
            .src([
                'src/a.js',
                'src/httpRequest.js',
                'src/sequence.js',
                'src/utils.js',
                dest + '/daktyloskop.js',
                'src/last.js'
            ])
            .pipe(concat('dakt.js'))
            .pipe(gulp.dest(dest))
            .pipe(gulp.dest('test'))
            .pipe(rename('dakt.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest(dest))
            .pipe(rename('dakt.obf.js'))
            .pipe(obfuscate({ replaceMethod: obfuscate.ZALGO }))
            .pipe(gulp.dest(dest))
        ;
    });
    return merge(tasks);
});

gulp.task('fullfillSitesIE', function () {
    var destPath = [__dirname, 'dist/'].join('/'),
        folders,
        dest,
        tasks
        ;
    folders = getFolders(destPath);
    tasks = folders.map(function (folder) {
        dest = 'dist/' + folder;
        return gulp
            .src([
                'src/daktyloskop-oldie.js'
            ])
            .pipe(concat('dakt-ie.js'))
            .pipe(gulp.dest(dest))
            .pipe(rename('dakt-ie.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest(dest))
            ;
    });
    return merge(tasks);
});

gulp.task('clean', ['fullfillSites'], function () {
    var destPath = [__dirname, 'dist/'].join('/');
    return del([
                destPath + '**/daktyloskop*.js'
            ])
});

gulp.task('build', ['clean']);