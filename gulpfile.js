var gulp = require('gulp');
var browserSync = require('browser-sync')
var sass = require('gulp-sass');
var cytoscape = require('cytoscape');

gulp.task('browserSync', function() {
  browserSync({
	files: ['src/js/*', 'src/css/*', 'index.html'],
    server: {
      baseDir: './'
    },
  })
  
  gulp.watch('*.html').on('change', browserSync.reload);
  gulp.watch('src/js/*.js').on('change', browserSync.reload);
});

gulp.task('default', function() {
  console.log('graphinius vis');
});

gulp.task('sass', function() {
  return gulp.src('lib/plotly/scss/*')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('lib/plotly/css'))
});

/*gulp.task('js', function() {
	gulp.src("src/*")
	.pipe(browserSync.stream());
});*/
