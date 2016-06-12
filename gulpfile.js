// WolfBeacon Gulpfile
// Nikhil Venkatesh || 28 May 2016


// Setup instructions
// ---------------------------
// install nodejs and npm
// Open terminal and browse to the project directory.
// Use this command to install all dependencies at once:
// npm install gulp gulp-newer gulp-jshint gulp-uglify gulp-sass gulp-css-globbing gulp-scss-lint gulp-minify-css gulp-autoprefixer gulp-file-include gulp-prettify gulp-remove-html-comments gulp-combine-media-queries --save-dev
// ALTERNATIVELY: npm install <package-name> --save-dev to install each package separately.

// NOTE: Browsersync has a different install command: npm install browser-sync gulp --save-dev

// Type "gulp" in terminal to start the session.
// Watch the magic happen!!


var gulp = require('gulp'),
	newer = require('gulp-newer'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	globbing = require('gulp-css-globbing'),
	scsslint = require('gulp-scss-lint'),
	minifycss = require('gulp-minify-css'),
	autoprefixer = require('gulp-autoprefixer'),
	include = require('gulp-file-include'),
	prettify = require('gulp-prettify'),
	removeComment = require('gulp-remove-html-comments'),
	cmq = require('gulp-combine-media-queries'); 

var browsersync = require('browser-sync').create(); 

// BrowserSync Static Server ------------------

gulp.task('serve', ['css'], function() {

    browsersync.init({
        server: "./",
        browser: "google chrome"
    });

    gulp.watch("src/sass/**/*.scss", ['css']);
    gulp.watch("*.html").on('change', browsersync.reload);
});

//CSS Linting ---------------------------------

gulp.task('lint-scss', function() {
	return gulp.src(['src/sass/**/*.scss', '!src/sass/vendor/*.scss'])
	.pipe(scsslint())
	.pipe(scsslint.reporter());
});

//JS Linting ----------------------------------

gulp.task('lint-js', function(){
	return gulp.src(['src/js/**/*.js', '!src/js/vendor/*.js'])
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'));
});

// GULP TASKS //-------------------------------
// Content ------------------------------------
gulp.task('html', function() {
	gulp.src('src/*.html')
	.pipe(include({
		basepath: ''
	}))
	.pipe(removeComment())
	.pipe(prettify({
		indent_with_tabs: "true"
	}))
	.pipe(gulp.dest('./'))
});

// Styles -------------------------------------
gulp.task('css', function(){
	gulp.src('src/sass/*.scss')
	.pipe(globbing({extensions: '.scss'})) // Glob all SASS files
	.pipe(sass()) // SASS Preprocessor
	.pipe(cmq()) // Combine all Media Queries
	.pipe(autoprefixer({browsers: ['last 4 versions'], cascade: false})) // Auto-Prefix
	.pipe(minifycss()) // Minify css
	.pipe(gulp.dest('assets/css'))
	.pipe(browsersync.stream());
});

// Scripts ------------------------------------
gulp.task('js', function(){
	gulp.src('src/js/**/*.js')
	.pipe(newer('assets/js'))
	.pipe(uglify())
	.pipe(gulp.dest('assets/js'));
});

// FUNCTIONS //--------------------------------
// Watch Function
gulp.task('watch', function() {
	gulp.watch('src/**/*.html', ['html']);
	gulp.watch('src/style/**/*.scss', ['css']);
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('src/**/*.md',['html']);
});

// Default Function
gulp.task('default', ['serve', 'watch'], function(){});


