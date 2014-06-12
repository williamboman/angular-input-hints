module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    uglify: {
      dist: {
        files: {
          'dist/placeholders.min.js': ['src/placeholders.js']
        }
      }
    }
  });

  grunt.registerTask('build', [
    'uglify'
  ]);
};
