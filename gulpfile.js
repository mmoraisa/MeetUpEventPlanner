var gulp = require('gulp');
var jade = require('gulp-jade');
var clean = require('gulp-clean');
var less = require('gulp-less');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');

gulp.task('clean-temp', function () {
    return gulp.src('./temp', {read: false,force: true})
	           .pipe(clean());
});

gulp.task('clean-dist', function () {
    return gulp.src('./dist', {read: false,force: true})
	           .pipe(clean());
});
 
gulp.task('jade',['clean-dist'], function() {
    return gulp.src('./src/*.jade')
	           .pipe(jade())
	           .pipe(gulp.dest('./dist/'))
});

gulp.task('less',['clean-temp'], function () {
	return gulp.src('./src/less/**/*.less')
			   .pipe(less())
			   .pipe(gulp.dest('./temp/css'));
});

gulp.task('concat-minify-css',['clean-dist','less'], function() {
  return gulp.src('./temp/css/**/*.css')
    .pipe(concat('vianuvem.min.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('default',['clean-temp','clean-dist','jade','less','concat-minify-css'],function(){
	gulp.start('clean-temp');
});