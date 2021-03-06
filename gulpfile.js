const gulp = require('gulp');
const ts = require('gulp-typescript');
const watch = require('gulp-watch');
const config = require('./config/index');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('resolve', done => {
    tsProject
        .src()
        .pipe(tsProject())
        .on('error', function(err) {
            console.log(err.toString());
            this.emit('end');
        })
        .js
        .pipe(gulp.dest(config.PATH));
    done();
});

gulp.task('watch', done => {
    watch('src/**', gulp.series('resolve'), () => {
        console.log('done');
    });
    done();
});
 
gulp.task('default', gulp.series('resolve', 'watch'));
