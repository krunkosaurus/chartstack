---
layout: post
title: About tests
---

[![Build Status](https://magnum.travis-ci.com/keenlabs/chartstack.svg?token=wfasM9dDfjzGTx53pqzt&branch=master)](https://magnum.travis-ci.com/keenlabs/chartstack)

Chartstack tests are built using [Jekyll](http://jekyllrb.com) and [Grunt-mocha-phantomjs](https://github.com/jdcataldo/grunt-mocha-phantomjs) allowing us to run tests both visually in the browser or via command-line with ci integration.

Select a test from the menu to proceed.

### Grunt commands
* Run `grunt test` creates these Jekyll test pages and execute all tests via command line, outputting the results.  Travis CI uses this command.
* Run `grunt test:dev` creates these Jekyll test pages and loads a web server for you to view.  Files are also watched for changes in case you want to write more tests.

### Related links

* [Github project page](https://github.com/keenlabs/chartstack)
* [Travis CI page](https://magnum.travis-ci.com/keenlabs/chartstack)


### Example code

This is a placeholder to show how we can use Jekyll's code syntax highlighting for future documentation:

{% highlight js %}
      var column = new chartstack.Chart({
        dataset: new chartstack.Dataset({
          adapter: 'keen-io',
          dateformat: 'MM-DD',
          url: '../api/keen/multilinechart.json'
        }),
        view: new chartstack.GoogleCharts.ColumnChart({
          title: 'Column chart',
          el: document.getElementById('column-js'),
          height: '300',
          stacked: true
        })
      });
{% endhighlight %}