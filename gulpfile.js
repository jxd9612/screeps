const gulp = require('gulp');
const ts = require('gulp-typescript');
const watch = require('gulp-watch');
const config = require('./config/index');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('resolve', done => {
    tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(config.PATH));
    done();
});

gulp.task('watch', done => {
    watch('src/**', gulp.series('resolve'));
    done();
});
 
gulp.task('default', gulp.series('resolve', 'watch'));
