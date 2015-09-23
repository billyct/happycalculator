var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');


gulp.task('default', function() {
  gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(rename({
      suffix : '.min'
    }))
    .pipe(gulp.dest('dist'));

});