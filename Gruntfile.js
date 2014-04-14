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
            '<%= chartstack.scriptPath %>/utils/chartstack.dataform.js',
            '<%= chartstack.scriptPath %>/utils/chartstack.csv.js',
            '<%= chartstack.scriptPath %>/utils/chartstack.moment.js',
            '<%= chartstack.scriptPath %>/adapters/chartstack.keen-io.js',
            '<%= chartstack.scriptPath %>/libraries/chartstack.googlecharts.js'
            //'<%= chartstack.scriptPath %>/renderset/chartstack.nvd3.renderset.js',
            //'<%= chartstack.scriptPath %>/renderset/chartstack.highcharts.renderset.js'
        ],
        dest: '<%= chartstack.distPath %>/chartstack.min.js'
      }
    },

    jshint: {
      options: {
          jshintrc: true
      },
      all: [
        // Manual designation, omit 3rd party scripts
        '<%= chartstack.scriptPath %>/chartstack.js',
        '<%= chartstack.scriptPath %>/util/chartstack.dataform.js',
        '<%= chartstack.scriptPath %>/util/chartstack.csv.js'
        //'<%= chartstack.scriptPath %>/*.js', '<%= chartstack.scriptPath %>/**/*.js'
      ]
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: './demo'
        }
      }
    },

    watch: {
      scripts: {
        files: "<%= chartstack.scriptPath %>/**/*.js",
        tasks: ['build']
      }
    }

  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Register tasks
  grunt.registerTask('build', ['jshint', 'uglify']);
  grunt.registerTask('serve', ['build', 'connect', 'watch']);
  // grunt.registerTask('test', ['build', 'connect', 'saucelabs-mocha']);
  grunt.registerTask('default', ['build']);

};
