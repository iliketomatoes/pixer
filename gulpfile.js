const gulp = require('gulp');
const header = require('gulp-header');

// using data from package.json
const pkg = require('./package.json');
let banner = ['/**',
	' * <%= pkg.name %> - <%= pkg.description %>',
	' * @version v<%= pkg.version %>',
	' * @link <%= pkg.homepage %>',
	' * @author <%= pkg.author %>',
	' * @license <%= pkg.license %>',
	' */',
	''
].join('\n');


gulp.task('default', function() {
	gulp.src('./dist/*.js')
		.pipe(header(banner, {
			pkg: pkg
		}))
		.pipe(gulp.dest('./dist/'));
});
