module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      }
    },

    concat: {
      dist: {
        src: ['src/<%= pkg.name %>.js', 'src/directive.js', 'src/service.js'],
        dest: 'dist/<%= pkg.name %>.js',
        options: {
          banner: grunt.file.read('src/intro').toString(),
          footer: grunt.file.read('src/outro').toString()
        }
      }
    },

    usebanner: {
      dist: {
        options: {
          banner: '/*\n' +
            '\t<%= pkg.name %> v<%= pkg.version %>\n' +
            '\t<%= pkg.homepage %>\n\n' +
            '\tCopyright (c) <%= grunt.template.today(\'yyyy\') %> <%= pkg.author.name %> <<%= pkg.author.email %>>\n\n' +
            '\tLicense: MIT (<%= pkg.homepage %>/blob/master/LICENSE)\n*/\n\n'
        },
        files: {
          src: ['dist/**/*.js']
        }
      }
    },

    karma: {
      unit: {
        configFile: 'test/karma.conf.js'
      }
    }
  });

  grunt.registerTask('build', [
    'concat:dist',
    'uglify:dist',
    'usebanner:dist'
  ]);

  grunt.registerTask('test', [
    'karma'
  ]);
};
