'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    postcss = require('gulp-postcss')

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: '',
        js: 'js/',
        css: 'css/',
        img: 'img/',
        fonts: 'fonts'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/style/main.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*' //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        //bloks: 'src/bloks/**/*.html' //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        templates: 'src/templates/**/*.scss'
    }
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
    .pipe(rigger()) //Прогоним через rigger //= template/footer.html
    .pipe(gulp.dest(path.build.html)); //Выплюнем их в папку build
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)/*('src/js/fullpubl.js')*/ //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        /*.pipe(sourcemaps.init())*/ //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        /*.pipe(sourcemaps.write())*/ //Пропишем карты
        .pipe(gulp.dest(path.build.js)); //Выплюнем готовый файл в build
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(rigger())
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cleanCSS()) //Сожмем
        /*.pipe(sourcemaps.write())*/
        .pipe(gulp.dest(path.build.css)); //И в build
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)); //И бросим в build
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build'
/*    'image:build'*/
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
/*    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });*/
    watch([path.watch.templates], function(event, cb) {
        gulp.start('style:build');
    });
});

gulp.task('default', ['build', 'watch']);