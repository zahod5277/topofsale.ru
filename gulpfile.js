var gulp = require('gulp'),
    templatePath = 'assets/templates/default/',
    concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'); // Подключаем gulp-uglifyjs (для сжатия JS)

gulp.task('css', function(){
    return gulp.src([
        templatePath + 'css/dist/bootstrap.css',
        templatePath + 'css/dist/typography.css',
        templatePath + 'css/dist/breadcrumbs.css',
        templatePath + 'css/dist/checkboxRadioButtons.css',
        templatePath + 'css/dist/collapse.css',
        templatePath + 'css/dist/fonts.css',
        templatePath + 'css/dist/footer.css',
        templatePath + 'css/dist/header.css',
        templatePath + 'css/dist/info.css',
        templatePath + 'css/dist/mainslider.css',
        templatePath + 'css/dist/modal.css',
        templatePath + 'css/dist/product.css',
        templatePath + 'css/dist/news.css',
        templatePath + 'css/dist/product-icon.css',
        templatePath + 'css/dist/sidebar.css',
        templatePath + 'css/dist/app.css',
        templatePath + 'css/dist/card-item.css',
        templatePath + 'css/dist/card.css',
        templatePath + 'css/dist/form.css',
        templatePath + 'css/dist/media.css',
        templatePath + 'css/dist/ion.rangeSlider.css',
        templatePath + 'css/dist/ion.rangeSlider.skinHTML5.css',
        templatePath + 'css/dist/schemaorg.css',
        templatePath + 'css/font-awesome.min.css',
        templatePath + 'css/fa-viber.css',
        '/assets/components/minishop2/css/web/default.css'
    ])
        .pipe(concat('app.min.css')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(cleanCSS({compatibility: '*'})) // Сжимаем JS файл
        .pipe(gulp.dest(templatePath + 'css/')); // Выгружаем в папку app/js 
});

gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        templatePath + 'js/jquery.min.js',
        templatePath + 'js/app.js',
        templatePath + 'js/ion.rangeSlider.min.js',
        templatePath + 'js/script.js'
        ])
        .pipe(concat('app.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest(templatePath + 'js/'));
});

gulp.task('build', ['css', 'scripts']);
