module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Project settings
    chartstack: {
      // configurable paths
      appPath: 'demo',
      scriptPath: 'src',
      distPath: 'dist',
      bowerPath: 'lib',
      testPath: 'test'
    },

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        stripBanners: false
      },
      all: {
        src: [
          '<%= chartstack.scriptPath %>/chartstack.js',
          '<%= chartstack.scriptPath %>/utils/chartstack.dataform.js',
          '<%= chartstack.scriptPath %>/utils/chartstack.csv.js',
          '<%= chartstack.scriptPath %>/adapters/chartstack.keen-io.js',
          '<%= chartstack.scriptPath %>/libraries/chartstack.keen-widgets.js',
          '<%= chartstack.scriptPath %>/libraries/chartstack.googlecharts.js',
          '<%= chartstack.bowerPath %>/momentjs/moment.js'
        ],
        dest: '<%= chartstack.distPath %>/chartstack.js'
      }
    },

    uglify: {
      options : {
        beautify : {
          ascii_only : true
        }
      },
      dist: {
        files: {
          '<%= chartstack.distPath %>/chartstack.min.js': '<%= chartstack.distPath %>/chartstack.js'
        }
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
      demo: {
        options: {
          port: 9001,
          base: './demo'
        }
      },
      test: {
        options: {
          port: 9001,
          base: './<%= chartstack.testPath %>/_site/',
          open: true,
          keepalive: true
        }
      },
    },

    watch: {
      scripts: {
        files: "<%= chartstack.scriptPath %>/**/*.js",
        tasks: ['build']
      },
      test: {
        files: [
          "<%= chartstack.testPath %>/index.html",
          "<%= chartstack.testPath %>/**/*.html"
        ],
        tasks: ['jekyll:dist']
      }
    },

    copy: {
      test: {
        files: [{
          src: ['<%= chartstack.bowerPath %>/**'],
          dest: '<%= chartstack.testPath %>/public',
          expand: true
        },{
          src: ['<%= chartstack.distPath %>/*'],
          dest: '<%= chartstack.testPath %>/public/'
        }]
      }
    },

    mocha_phantomjs: {
      all: ['./<%= chartstack.testPath %>/_site/test*/index.html'],
      options:{
        base: './test'
      }
    },

    jekyll: {
      options: {
        src : './<%= chartstack.testPath %>',
        dest: './<%= chartstack.testPath %>/_site',
        config: './<%= chartstack.testPath %>/_config.yml'
      },
      dist: {
        options: {
        }
      },
      serve: {
        options: {
          serve: true,
          watch: true
        }
      }
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Build and Serve
  grunt.registerTask('build', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('serve', ['build', 'connect:demo', 'watch:scripts']);

  // Testing via command-line and CI.
  grunt.registerTask('test', ['copy:test', 'jekyll:dist', 'mocha_phantomjs']);

  // Testing via browser and visually.
  grunt.registerTask('test:dev', ['copy:test', 'jekyll:serve']);
  grunt.registerTask('default', ['build']);

  // Optional aliases
  //grunt.registerTask('lint', ['jshint']);
  //grunt.registerTask('min', ['uglify']);
};
