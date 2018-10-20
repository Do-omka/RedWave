'use strict'
const
	gulp = require('gulp')
	,sourcemaps = require('gulp-sourcemaps')
	,postcss = require('gulp-postcss')
	,less = require('gulp-less')
	,imgmin = require('gulp-imagemin')
	,htmlmin = require('gulp-htmlmin')
	,jsmin = require('gulp-uglify')
	,pump = require('pump')
	,concat = require('gulp-concat')
	,del = require('del')

function mincss () {
	return gulp.src('src/less/*.less')
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.identityMap())
		.pipe(postcss([
			require('postcss-svgo')
		]
		,{syntax: require('postcss-less')}
		))
		.pipe(concat('main.css'))
		.pipe(less())
		.pipe(postcss([
			require('autoprefixer')
			,require('postcss-csso')
			,require('postcss-focus')
		]))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest('docs/css'))
}

function minhtml () {
	return gulp.src('src/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('docs'))
}

function minimg () {
	del(['docs/imgs'])
	return gulp.src('src/img/*')
		.pipe(imgmin())
		.pipe(gulp.dest('docs/img'))
}

function minjs (cb) {
	pump([
		gulp.src('src/js/*.js')
			.pipe(sourcemaps.init())
			.pipe(concat('main.js'))
			.pipe(sourcemaps.identityMap())
			.pipe(jsmin())
			.pipe(sourcemaps.write(''))
		,gulp.dest('docs/js')
	],
	cb
	)
}

function watchcss () {
	return gulp.watch('src/less/*.less', mincss)
}

function watchjs () {
	return gulp.watch('src/js/*.js', minjs)
}

gulp.task('default', gulp.series(mincss, minhtml, minjs, gulp.parallel(watchcss, watchjs)))
gulp.task(minimg);
