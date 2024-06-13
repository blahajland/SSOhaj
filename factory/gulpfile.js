import {dest, series, src, task} from "gulp";
import pug from 'gulp-pug'
import formatHTML from "gulp-format-html";
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';

const paths = {
    templates: {
        src: './html/*.pug',
        dest: '../portal/'
    },
    styles: {
        src: './css/ynh_portal.sass',
        dest: '../portal/assets/css'
    },
    scripts: {
        src: './js/ynh_portal.js',
        dest: '../portal/assets/js'
    },
    locales: {
        src: './locales/*.json',
        dest: '../portal/locales/'
    }
}

const sass = gulpSass(dartSass)

task('styles', () =>
    src(paths.styles.src)
        .pipe(sass())
        .pipe(dest(paths.styles.dest))
)

task('templates', () =>
    src(paths.templates.src)
        .pipe(pug())
        .pipe(formatHTML())
        .pipe(dest(paths.templates.dest))
)

task('scripts', () =>
    src(paths.scripts.src)
        .pipe(dest(paths.scripts.dest))
)

task('locales', () =>
    src(paths.locales.src)
        .pipe(dest(paths.locales.dest))
)

task('default', series('templates', 'styles', 'scripts', 'locales'))