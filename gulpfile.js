const gulp = require('gulp');
const ts = require('gulp-typescript');
const screeps = require('gulp-screeps');
const config = require('./config/index');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('screeps', done => {
    gulp.src('dist/**/*.js').pipe(screeps(config));
    done();
});

gulp.task('resolve', done => {
    tsProject.src().pipe(tsProject()).js.pipe(gulp.dest('dist'));
    done();
});
 
gulp.task('default', gulp.series('resolve', 'screeps', done => {
    done();
}));
