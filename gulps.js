const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const gcmq = require('gulp-group-css-media-queries');
const less = require('gulp-less');

const isDev = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;
const isSync = (process.argv.indexOf('--sync') !== -1);

let cssFiles = [
    './node_modules/normalize.css/normalize.css',
    './src/css/base.css',
    './src/css/grid.css',
    './src/css/humans.css'
];

function clear(){
    return del('build/*');
}

function styles(){
    return gulp.src(cssFiles)
        .pipe(gulpif(isDev, sourcemaps.init()))
        .pipe(less())
        // .pipe(concat('style.css'))
        // .on('error', console.error.bind(console))
        .pipe(gcmq())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 20 versions'],
            cascade: false
        }))
        .pipe(gulpif(isProd, cleanCSS({
            level: 2
        })))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/css'))
        .pipe(gulpif(isSync, browserSync.stream()));
}

function img(){
    return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./build/img'))
}
function html(){
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./build'))
        .pipe(gulpif(isSync, browserSync.stream()));
}

function watch(){
    if(isSync){
        browserSync.init({
            server: {
                baseDir: "./build/"
            },
            tunnel: true

        });
    }

    gulp.watch('./src/css/**/*.css', styles);
    gulp.watch('./src/**/*.html', html);
}

let build = gulp.series(clear,
    gulp.parallel(styles, img, html) 
);

gulp.task('build', build);
gulp.task('watch', gulp.series(build, watch));