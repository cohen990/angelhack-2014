module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      js: {
        src: ['app/js/**/*.js'],
        dest: 'dist/application.js'
      },
      css: {
        src: ['app/css/**/*.css'],
        dest: 'dist/application.css'
      }
    }
  });
};
