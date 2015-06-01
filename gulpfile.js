var gulp = require('gulp'),
    zip = require('gulp-zip'),
    less = require('gulp-less'),
    path = require('path'),
    rename = require('gulp-rename'),
    insert = require('gulp-insert'),
    sftp = require('gulp-sftp'),
    debug = require('gulp-debug'),
    watch = require('gulp-watch'),
    config = require('./config.json');

function sftpOptions(_path) {
  return {
    host: config.sftp.host,
    user: config.sftp.user,
    pass: config.sftp.pass,
    remotePath: config.sftp.remotePath + (_path || "")
  }
}

gulp.task('zip', ['less'], function() {
  return gulp.src('plugin/**', {base: './plugin'})
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest(config.dest.zip));
});

gulp.task('less', function() {
  return gulp.src('less/plugin.less')
    .pipe(less())
    .pipe(rename('styles.css'))
    .pipe(gulp.dest(config.dest.less));
});

gulp.task('move', ['less'], function() {
  gulp.src(config.src.move)
    .pipe(gulp.dest(config.dest.move))
});

gulp.task('sftp', ['move'], function() {
  gulp.src(config.src.sftp.scripts)
    .pipe(debug())
    .pipe(sftp(sftpOptions('scripts')));

  gulp.src(config.src.sftp.images)
    .pipe(debug())
    .pipe(sftp(sftpOptions('images')));
});

gulp.task('watch', function() {
  gulp.watch(config.src.watch, ['less', 'zip', 'move', 'sftp']);
});

gulp.task('default', ['zip', 'less', 'move', 'sftp']);
