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
            '<%= chartstack.scriptPath %>/adapters/chartstack.keen-io.js',
            '<%= chartstack.scriptPath %>/libraries/chartstack.keen-widgets.js',
            '<%= chartstack.scriptPath %>/libraries/chartstack.googlecharts.js',
            //'<%= chartstack.scriptPath %>/renderset/chartstack.nvd3.renderset.js',
            //'<%= chartstack.scriptPath %>/renderset/chartstack.highcharts.renderset.js'
            '<%= chartstack.bowerPath %>/simg/src/simg.js',
            '<%= chartstack.scriptPath %>/utils/simg.noconflict.js',
            '<%= chartstack.bowerPath %>/momentjs/min/moment.min.js'
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
          keepalive: false
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
      all: {
        options:{
          //base: './test',
          urls: [
            'http://localhost:9001/test-core/',
            'http://localhost:9001/test-google-charts/'
          ]
        }
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
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Register tasks
  grunt.registerTask('build', ['jshint', 'uglify']);
  grunt.registerTask('serve', ['build', 'connect:demo', 'watch:scripts']);
  // Testing via command-line and CI.
  grunt.registerTask('test', ['copy:test', 'jekyll:dist', 'connect:test', 'mocha_phantomjs']);
  // Testing via browser and visually.
  grunt.registerTask('test:dev', ['copy:test', 'jekyll:serve']);
  grunt.registerTask('default', ['build']);

  // Optional aliases
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('min', ['uglify']);
};
