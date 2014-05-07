---
layout: default
title: About Test Suite
---

# About Test Suite
Chartstack tests are built using [Jekyll](http://jekyllrb.com) and [Grunt-mocha-phantomjs](https://github.com/jdcataldo/grunt-mocha-phantomjs) allowing us to run tests both visually in the browser or via command-line with ci integration.

Select a test from the menu to proceed.

### Grunt commands
* Run `grunt test` creates these Jekyll test pages and execute all tests via command line, outputting the results.  Travis CI uses this command.
* Run `grunt test:dev` creates these Jekyll test pages and loads a web server for you to view.  Files are also watched for changes in case you want to write more tests.

### Related links

* [Github project page](https://github.com/keenlabs/chartstack)
* [Travis CI page](https://magnum.travis-ci.com/keenlabs/chartstack)
