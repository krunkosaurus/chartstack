module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Project settings
    chartstack: {
      // configurable paths
      appPath: 'demo',
      scriptPath: 'src',
      distPath: 'dist'
    },

    pkg: grunt.file.readJSON('package.json'),

    mocha_phantomjs: {
      all: ['demo/universal-nvd3/*.html', 'demo/universal-googlecharts/*.html']
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'gzip',
        sourceMap: true,
        sourceMapIncludeSources: true
      },
      build: {
        src: [
            '<%= chartstack.scriptPath %>/chartstack.js',
            '<%= chartstack.scriptPath %>/util/chartstack.diver.js',
            '<%= chartstack.scriptPath %>/util/chartstack.csv.js',
            '<%= chartstack.scriptPath %>/adapter/chartstack.keen.universal.adapter.js',
            '<%= chartstack.scriptPath %>/renderset/chartstack.googlecharts.renderset.js',
            '<%= chartstack.scriptPath %>/renderset/chartstack.nvd3.renderset.js',
            '<%= chartstack.scriptPath %>/renderset/chartstack.highcharts.renderset.js'
        ],
        dest: '<%= chartstack.distPath %>/chartstack.min.js'
      }
    },

    jshint: {
      options: {
          jshintrc: true
      },
      all: ['<%= chartstack.scriptPath %>/*.js', '<%= chartstack.scriptPath %>/**/*.js']
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: './demo',
          keepalive: true,
          open: 'http://localhost:9001/index.html'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');

  // Default task(s).
  grunt.registerTask('default', ['connect']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('min', ['uglify']);
  grunt.registerTask('serve', ['connect']);
  grunt.registerTask('test', ['mocha_phantomjs']);

};
