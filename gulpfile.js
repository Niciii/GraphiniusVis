var gulp        = require('gulp');
var browserSync = require('browser-sync')
var sass        = require('gulp-sass');
// var cytoscape = require('cytoscape');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var glob        = require('glob');

gulp.task('browserSync', function() {
  browserSync({
	files: ['src/core/*', 'index.html'],
    server: {
      baseDir: './'
    },
  })

  gulp.watch('*.html').on('change', browserSync.reload);
  gulp.watch('src/core/*.js').on('change', browserSync.reload);
});

gulp.task('default', function() {
  console.log('graphinius vis');
});

// gulp.task('sass', function() {
//   return gulp.src('lib/plotly/scss/*')
//     .pipe(sass()) // Using gulp-sass
//     .pipe(gulp.dest('lib/plotly/css'))
// });

// TODO use globs...
// gulp.task('browserify-bundle', function() {
//     return browserify({ entries: ['src/node_js/firstTest.js', 'src/node_js/testNGraphPin.js', 'src/node_js/testPixelStatic.js'] })
//         .bundle()
//         .pipe(source('bundle-node.js'))
//         .pipe(gulp.dest('build'))
//         .pipe(browserSync.stream());
// });
