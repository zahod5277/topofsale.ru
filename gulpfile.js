// npm install gulp-svgstore gulp-rename gulp-svgmin gulp-inject path gulp-uglify gulp-cssnano gulp-rigger gulp-cheerio
var gulp = require('gulp'),
    templatePath = 'assets/templates/default/',
    concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'); // Подключаем gulp-uglifyjs (для сжатия JS)

gulp.task('css', function(){
    return gulp.src([
        templatePath + 'css/*.css'
    ])
        .pipe(concat('app.min.css')) // Собираем их в кучу в новом файле libs.min.js
        //.pipe(cleanCSS({compatibility: '*'})) // Сжимаем JS файл
        .pipe(gulp.dest(templatePath + 'css/')); // Выгружаем в папку app/js 
});

gulp.task('build', ['css']);
