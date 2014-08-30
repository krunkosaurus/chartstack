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

    // Called by `grunt build`.
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'gzip',
        sourceMap: true,
        sourceMapIncludeSources: true
      },
      build: {
        src: [
            // Chartstack core functionality.
            '<%= chartstack.scriptPath %>/chartstack.core.js',
            // Utilities shared by all chartstack components.
            '<%= chartstack.scriptPath %>/chartstack.utils.js',
            // Chartstack view class.
            '<%= chartstack.scriptPath %>/chartstack.view.js',
            // Chartstack model class.
            '<%= chartstack.scriptPath %>/chartstack.model.js',
            // CSV transformer plugin.
            '<%= chartstack.scriptPath %>/utils/chartstack.cvs.transform.js',
            // Keen data transform adapter.
            '<%= chartstack.scriptPath %>/adapters/chartstack.keen.data.adapter.js',
            // Google charts library support
            '<%= chartstack.scriptPath %>/libraries/chartstack.googlecharts.renderset.js'
        ],
        dest: '<%= chartstack.distPath %>/chartstack2.min.js'
      }
    },

    jshint: {
      options: {
          jshintrc: true
      },
      all: [
        // Manual designation, omit 3rd party scripts
        '<%= chartstack.scriptPath %>/chartstack2.js'
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
          hostname: '*',
          port: 4000,
          base: './<%= chartstack.testPath %>/_site/',
        }
      },
      /* Used during command-line/CI testing only. */
      'test-ci': {
        options: {
          port: 5000,
          base: './<%= chartstack.testPath %>/_site/',
          keepalive: false
        }
      },
    },

    watch: {
      // Used by grunt:serve
      scripts: {
        files: "<%= chartstack.scriptPath %>/**/*.js",
        tasks: ['build']
      },
      // Used by grunt test:dev
      test: {
        files: [
          '<%= chartstack.scriptPath %>/**/*.js',
          '<%= chartstack.testPath %>/index.md',
          '<%= chartstack.testPath %>/public/css/*.css',
          '<%= chartstack.testPath %>/visual-*/*.html',
          '<%= chartstack.testPath %>/test-*/*.html',
          '<%= chartstack.testPath %>/_includes/*.html',
          '<%= chartstack.testPath %>/blog/*.html',
          '<%= chartstack.testPath %>/blog/_posts/*.*'
        ],
        tasks: ['build', 'copy:test', 'jekyll:dist']
      },
      docs: {
        files: ['<%= chartstack.scriptPath %>/chartstack.*.js'],
        tasks: ['jsdoc']
      }
    },

    copy: {
      // Copy files for Jekyll tests.
      test: {
        files: [{
          // Copy api folder to test folder.
          cwd: '<%= chartstack.appPath %>/api/',
          src: ['**'],
          dest: '<%= chartstack.testPath %>/api',
          expand: true
        },{
          // Copy bower installs to test/public folder.
          src: ['<%= chartstack.bowerPath %>/**'],
          dest: '<%= chartstack.testPath %>/public',
          expand: true
        },{
          // Copy /dist files to test/public/dist folder.
          src: ['<%= chartstack.distPath %>/**'],
          dest: '<%= chartstack.testPath %>/public/',
          expand: true
        }]
      }
    },

    // Command-line / CI testing.
    mocha_phantomjs: {
      all: {
        options:{
          //base: './test',
          urls: [
            'http://localhost:5000/test-core/',
            'http://localhost:5000/test-data/',
            'http://localhost:5000/test-utils/',
            'http://localhost:5000/test-google-charts/'
          ]
        }
      }
    },

    jsdoc : {
        dist : {
            src: ['src/chartstack.*.js'],
            options: {
                destination: 'doc'
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
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jsdoc');

  // Build and Serve
  grunt.registerTask('build', ['jshint', 'uglify']);
  grunt.registerTask('serve', ['build', 'connect:demo', 'watch:scripts']);

  // generate and watch docs
  grunt.registerTask('docs', ['watch:docs', 'jsdoc']);

  // Testing via command-line and CI.
  grunt.registerTask('test', ['build', 'copy:test', 'jekyll:dist', 'connect:test-ci', 'mocha_phantomjs']);
  // Testing via browser and visually.
  grunt.registerTask('test:dev', ['build', 'copy:test', 'jekyll:dist', 'connect:test', 'watch:test']);
  grunt.registerTask('default', ['build']);

  // Optional aliases
  //grunt.registerTask('lint', ['jshint']);
  //grunt.registerTask('min', ['uglify']);
};
