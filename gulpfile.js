/**
 * Created by lavor on 19.05.2016.
 */
var gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    prefix = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    uncss = require('gulp-uncss'),
    sass = require('gulp-sass'),
    cleanCss = require('gulp-clean-css');

// соединение для ливрелоада
gulp.task('connect', function () {
    connect.server({
        root: 'app',
        livereload: true
    })
});
// преобразовывает SASS в CSS добавляет префиксы и минифицирует
gulp.task('css', function () {
    gulp.src('app/scss/*.scss')
        .pipe(sass())
        .pipe(prefix('last 3 versions'))
        .pipe(cleanCss())
        .pipe(gulp.dest('app/css'))
        .pipe(connect.reload());
});
// убирает неиспользованый css
gulp.task('uncss', function () {
    return gulp.src('app/css/*.css')
        .pipe(uncss({
            html: ['app/*.html']
        }))
        .pipe(prefix('last 2 versions'))
        .pipe(cleanCss())
        .pipe(gulp.dest('app/css'));
});
// убирает неиспользованый css из бутстрапа
gulp.task('bootstrap', function () {
    return gulp.src('app/bower_components/bootstrap/dist/css/bootstrap.css')
        .pipe(uncss({
            html: ['app/index.html']
        }))
        .pipe(cleanCss())
        .pipe(gulp.dest('app/css'));
});
// минифицирует js
gulp.task('js', function() {
    return gulp.src('app/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'));
});
// bower
gulp.task('bower', function () {
    gulp.src('app/*.html')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app'));
});

// следит за файлами
gulp.task('watch', function () {
    gulp.watch('bower.json', ['bower']);
    gulp.watch('app/scss/*.scss', ['css']);
});
// делает деплой
gulp.task('makeDep', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cleanCss()))
        .pipe(gulp.dest('dist'))
});


gulp.task('default', ['connect', 'css', 'watch']);


gulp.task('deploy', ['makeDep']);