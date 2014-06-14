module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      js: {
        src: ['app/js/**/*.js'],
        dest: 'dist/application.js'
      },
      css: {
        src: ['tmp/cache/css/**/*.css'],
        dest: 'dist/application.css'
      }
    },
    sass: {
      dist: {
        files: {
          'tmp/cache/css/cards.css': 'app/css/cards.scss'
        }
      }
    },
    watch: {
      js: {
        files: ['app/js/**/*.js'],
        tasks: ['compile:js']
      },
      css: {
        files: ['app/css/**/*.scss'],
        tasks: ['compile:css']
      }
    }
  });

  grunt.registerTask('compile:css', ['sass:dist', 'concat:css']);
  grunt.registerTask('compile:js', ['concat:js']);
};
