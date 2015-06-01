module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  var files = ['*.js', 'app/**/*.js', 'config/*.js', 'test/**/*.js'];

  grunt.initConfig({

    jshint: {
      files: files
    },

    jscs: {
      src: files,
      options: {
        config: '.jscsrc'
      }
    }

  });

  grunt.registerTask('test', ['jshint', 'jscs']);

  grunt.registerTask('default', ['jshint', 'jscs']);

};
