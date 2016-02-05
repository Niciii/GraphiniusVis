var gulp = require('gulp');
var browserSync = require('browser-sync')
var sass = require('gulp-sass');
var cytoscape = require('cytoscape');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('browserSync', ['browserify'], function() {
  browserSync({
	files: ['src/js/*', 'src/node js/*', 'src/css/*', 'index.html'],
    server: {
      baseDir: './'
    },
  })
  
  gulp.watch('*.html').on('change', browserSync.reload);
  gulp.watch('src/js/*.js').on('change', browserSync.reload);
  gulp.watch('src/node js/*', ['browserify']);
});

gulp.task('default', function() {
  console.log('graphinius vis');
});

gulp.task('sass', function() {
  return gulp.src('lib/plotly/scss/*')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('lib/plotly/css'))
});

gulp.task('browserify', function() {
    return browserify({ entries: ['src/node js/node.js'] })
        .bundle()
        .pipe(source('bundle-node.js'))
        .pipe(gulp.dest('bundle'))
        .pipe(browserSync.stream());
});

