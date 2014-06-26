---
layout: default
title: About Test Suite
---
# What is Chartstack?

Chartstack is a data visualization, interaction, and exploration tool. It's built on top of other open-source charting libraries, extending them with extra features and abstracting away their differences, so that you can focus on diving through and visualizing your data.

Chartstack allows you to <a href="#" onclick="document.getElementsByTagName('ol')[0].style.display = 'block'; return false;">[...]</a>:

1. **Become chart framework agnostic.** Chartstack has a consistent JS charting API so that you can visualize your data using visuals from charting libraries like Google Charts or NVD3 - even mix and match charts from different libraries, all without learning those specific charting library API's. Just learn Chartstack.
2. **Become data format agnostic:** You can mix and match data sources in your charts without worrying about the differences in data structure. Want to compare your Fitbit weekly stats to your Nike Fuelband? Apache error logs to your web applications hourly logins?  It's easy (demo link). Check out the current list of data adapters (link) or read the tutorial (link) on how to build your own to support your own data format.
3. **Bring your data to life**: Chartstack adds dynamic abilities to static charts including a familiar event model you can subscribe/trigger events with, the ability to download screenshots of your charts, features such as auto polling for new data, and more.
4. **Find the value in your data**: Chartstack's Data model class allows you to fetch and filter through data, merge two data sources, group large data to see the big picture, and much more.

<script>
document.getElementsByTagName('ol')[0].style.display = 'none';
</script>

# About Test Suite
Chartstack tests are built using [Jekyll](http://jekyllrb.com) and [Grunt-mocha-phantomjs](https://github.com/jdcataldo/grunt-mocha-phantomjs) allowing us to run tests both visually in the browser or via command-line with ci integration.

Select a test from the menu to proceed.

### Grunt commands
* Run `grunt test` creates these Jekyll test pages and execute all tests via command line, outputting the results.  Travis CI uses this command.
* Run `grunt test:dev` creates these Jekyll test pages and loads a web server for you to view.  Files are also watched for changes in case you want to write more tests.

### Related links

* [Github project page](https://github.com/keenlabs/chartstack)
* [Travis CI page](https://magnum.travis-ci.com/keenlabs/chartstack)
