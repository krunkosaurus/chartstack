module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Project settings
    chartstack: {
      // configurable paths
      appPath: 'app',
      scriptPath: 'app/scripts',
      distPath: 'dist'
    },

    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'gzip'
      },
      build: {
        src: [
            '<%= chartstack.scriptPath %>/chartstack.js',
            '<%= chartstack.scriptPath %>/chartstack.keen.nvd3.adapter.js',
            '<%= chartstack.scriptPath %>/chartstack.nvd3.renderer.js'
        ],
        dest: '<%= chartstack.distPath %>/chartstack.nvd3.min.js'
      }
    },

    jshint: {
      options: {
          jshintrc: true
      },
      all: '<%= chartstack.scriptPath %>/*.js'
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: '<%= chartstack.appPath %>/',
          keepalive: true
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
