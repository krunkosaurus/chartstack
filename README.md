# Chartstack

Chartstack is JavaScript charting library and abstraction layer that enables a user to visualize their data using any of many popular charting libraries that Chartstack supports using one unified JavaScript API. Chartstack's goal is to allow any data format to work with any charting library, including your own custom data formats.  Chartstack also includes an optional dom-centric "easy embed" feature.  Chartstack is open-source and made by the guys and gals at [KEEN IO](https://keen.io/).

Key features:
- A unified JavaScript charting API that works across a growing list of popular charting libraries.
- A plugin architecture to transform data into a unified format charting libraries can understand.
- An optional "easy embed" API that extends HTML with new simple, yet powerful, charting elements like &lt;piechart> and &lt;barchart>.


## Table of contents

 - [Introduction and architecture](#introduction-and-architecture)
 - [How to install](#introduction-and-architecture)
 - [Bugs and feature requests](#bugs-and-feature-requests)
 - [Documentation](#documentation)
 - [Compiling CSS and JavaScript](#compiling-css-and-javascript)
 - [Contributing](#contributing)
 - [Community](#community)
 - [Versioning](#versioning)
 - [Authors](#authors)
 - [Copyright and license](#copyright-and-license)

## Introduction and architecture

We recognize that everybody collects data in different ways and every charting library has it's own arbitrary data format for displaying that data, that's why ChartStack comes with easy methods to normalize incoming data to one unified format. Though there is no real standard for displaying data in charts, once you've setup the normalization plugin for your data source, all charts just work.  We've already included a normalization plugin for Keen IO data sources and the community is invited to add theirs in the ChartStack Github repo.

[Insert diagram here if how adapters and renderers and universal data works.]

## How to install

There are three ways to install:

1. [Download the latest release](https://github.com/krunkosaurus/chartstack/archive/v0.0.1.zip). NOT READY
2. Clone the repo: `git clone https://github.com/krunkosaruus/chartstack.git`.
	- Run `npm install` to setup Grunt tasks
	- Run `bower install` to install 3rd party JS libraries
	- Run `grunt connect` to launch the webserver and view the demos at [http://localhost:9001/](http://localhost:9001/].
3. Install with [Bower](http://bower.io): `bower install chartstack`. NOT READY

### Project architecture

If you're checked out this repo on Github. You'll see something like this. Here's an explanation of what everything is:

```
.
├── Gruntfile.js	# Grunt tasks used to minify JS and start test server.
├── README.md		# This document.
├── demo			# When you run `grunt connect` this is the demo folder you are accessing.
│   ├── api
│   ├── bower_components
│   ├── css
│   ├── index.html
│   ├── keen-googlecharts
│   ├── keen-highcharts
│   ├── keen-nvd3
│   ├── scripts
│   ├── universal-googlecharts
│   ├── universal-highcharts
│   └── universal-nvd3
├── bower.json		# Tells Bower which 3rd party apps to install to demo/bower_components
├── dist			# Where the final compressed Chartstack file goes.
│   ├── chartstack.min.js
├── node_modules	# Various node modules used by Grunt tasks
├── package.json	# Tells Npm which node packages to install
└── todo.org		# Just a todo list


```

### Install Grunt

From the command line:

1. Install `grunt-cli` globally with `npm install -g grunt-cli`.
2. Then run `npm install` in the root of this project. npm will look at [package.json](https://github.com/krunkosaurus/chartstack/blob/master/package.json) and automatically install the necessary local dependencies listed there.

When completed, you'll be able to run the various Grunt commands provided from the command line.

**Unfamiliar with npm? Don't have node installed?** That's a-okay. npm stands for [node packaged modules](http://npmjs.org/) and is a way to manage development dependencies through node.js. [Download and install node.js](http://nodejs.org/download/) before proceeding.

### Available Grunt commands

#### Build - `grunt`
Run `grunt` to minify all Chartstack JavaScript files to chartstack.min.js in `/dist`. **Uses [UglifyJS](http://lisperator.net/uglifyjs/).**

#### Launch test server - `grunt connect`
Run `grunt connect` to start a test server locally accessible in your web browser at [http://localhost:9001/](http://localhost:9001/).  This is useful for running the demos which require ajax.

#### Lint JavaScript files - `grunt jshint`
Run `grunt jshint` to check all chartstack.* JavaScript files for errors and warnings.

### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

## Bugs and feature requests

Have a bug or a feature request? If your problem or idea is not addressed yet, [please open a new issue](https://github.com/krunkosaurus/chartstack/issues/new).

## Support

Need a hand with something? Join us in [HipChat](http://users.keen.io/), [IRC](http://webchat.freenode.net/?channels=keen-io), or shoot us an email at [contact@keen.io](mailto:contact@keen.io)

## Copyright and license

Code and documentation copyright 2014 KEEN IO, Inc. Code released under [the MIT license](LICENSE). Docs released under [Creative Commons](docs/LICENSE).
