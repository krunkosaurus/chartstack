# Chartstack

Chartstack is a charting library and abstraction layer that enables a user to visualize their data on top of many popular charting libraries using one unified JavaScript API. Chartstack's goal is to allow any data format to work with any charting library, including your own custom data formats. Charstack is created and maintained by [Keen IO](http://keen.io/).

Key features:
- A unified JavaScript charting API that works across a growing list of popular charting libraries.
- A plugin architecture to transform data into a unified format charting libraries can understand.
- An optional "easy embed" API that extends HTML with new simple, yet powerful, charting elements like &lt;piechart> and &lt;barchart>.

## Table of contents

 - [Demos](#demos)
 - [Introduction and architecture](#introduction-and-architecture)
 - [How to install](#introduction-and-architecture)
 - [Documentation](#documentation)
 - [Bugs and feature requests](#bugs-and-feature-requests)
 - [Copyright and license](#copyright-and-license)

## Demos

Visit [http://krunkosaurus.github.io/chartstack](http://krunkosaurus.github.io/chartstack) to see the demos. (Coming soon)

## Introduction and architecture

We recognize that everybody collects data in different ways and every charting library has it's own arbitrary data format for displaying that data, that's why ChartStack comes with easy methods to normalize incoming data to one unified format. Though there is no real standard for displaying data in charts, once you've setup the normalization plugin for your data source, all charts just work.  We've already included a normalization plugin for Keen IO data sources and the community is invited to add theirs in the ChartStack Github repo.

[Insert diagram here if how adapters and renderers and universal data works.]

## How to install

There are three ways to install.

## Documentation

Chartstack wiki coming soon!

#### Developer version with demos and test suite:

- Clone the repo: `git clone https://github.com/krunkosaruus/chartstack.git`.
- Run `npm install` to setup Grunt and node packages it uses in tasks.
- Run `bower install` to install 3rd party JS libraries.
- Run `grunt` to launch the web server and view the demos. [http://localhost:9001/demo/](http://localhost:9001/demo/).

#### Grab just the minified Chartstack file:	
- [Download the latest release](https://github.com/krunkosaurus/chartstack/releases/download/v0.0.1/chartstack.min.js) (1.58 kB gzipped)
- You must include your favorite charting library above chartstack.min.js and it will be autodetected.

#### Install directly into your project with [Bower](http://bower.io):
- `bower install chartstack` in your project folder will download Chartstack and all supported charting libraries in to your `bower_components` folder.
- Feel free to delete the charting libraries you do not want to use.
- You can reference the uncompressed chartstack files (in `chartstack/src`) or just the compressed file (in `chartstack/dist`).

### Project architecture

If you checked out this repo on Github you'll see a folder structure like this. Here's an explanation of what everything is:

```
.
├── Gruntfile.js	# Grunt tasks used to minify JS and start test server.
├── README.md		# This document.
├── demo			# When you run `grunt connect` this is the demo folder you are accessing.
│   ├── api					# Sample API calls JSON.
│   ├── bower_components	# The location of 3rd Party charting libraries.
│   ├── css					# Unimportant CSS styles for this demo.
│   ├── index.html			# Demo start page.
│   ├── keen-googlecharts	# Demo: http://keen.io data interacting with Google Charts.
│   ├── keen-highcharts		# Demo: http://keen.io data interacting with Highcharts.
│   ├── keen-nvd3			# Demo: http://keen.io data interacting with NVD3 Charts.
│   ├── universal-googlecharts	# Demo: Universal data interacting with Google Charts
│   ├── universal-highcharts	# Demo: Universal data interacting with Highcharts.
│   └── universal-nvd3			# Demo: Universal data interacting with NVD3 Charts.
├── bower.json		# Tells Bower which 3rd party apps to install to demo/bower_components
├── dist			# Where the final compressed Chartstack bundle goes.
│   ├── chartstack.min.js	# Currently bundles all adapters and renderers due to small size.
├── node_modules	# Various node modules used by Grunt tasks.
├── package.json	# Tells Npm which node packages to install.
└── todo.org		# Just a todo list.


```

### How to install Grunt

From the command line:

1. Install `grunt-cli` globally with `npm install -g grunt-cli`.
2. Then run `npm install` in the root of this project. npm will look at [package.json](https://github.com/krunkosaurus/chartstack/blob/master/package.json) and automatically install the necessary local dependencies listed there.

When completed, you'll be able to run the various Grunt commands provided from the command line.

**Unfamiliar with npm? Don't have node installed?** That's a-okay. npm stands for [node packaged modules](http://npmjs.org/) and is a way to manage development dependencies through node.js. [Download and install node.js](http://nodejs.org/download/) before proceeding.

### Available Grunt commands

#### Launch web server - `grunt`
Run `grunt` to start a test server locally accessible in your web browser at [http://localhost:9001/demo](http://localhost:9001/demo/).  This is useful for running the demos which require ajax.

#### Compress files - `grunt min`
Run `grunt min` to minify all Chartstack JavaScript files to chartstack.min.js in `/dist`. **Uses [UglifyJS](http://lisperator.net/uglifyjs/).**

#### Lint JavaScript files - `grunt jshint`
Run `grunt lint` to check all chartstack.* JavaScript files for errors and warnings.  The file `.jshintrc` contains the linting rules. **Uses [jshint](http://www.jshint.com/).**

### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

## Bugs and feature requests

Have a bug or a feature request? If your problem or idea is not addressed yet, [please open a new issue](https://github.com/krunkosaurus/chartstack/issues/new).

## Support

Need a hand with something? Join us in [HipChat](http://users.keen.io/), [IRC](http://webchat.freenode.net/?channels=keen-io), or shoot us an email at [contact@keen.io](mailto:contact@keen.io)

## Copyright and license

Code and documentation copyright 2014 Keen IO, Inc. Code released under [the MIT license](LICENSE). Docs released under [Creative Commons](docs/LICENSE).
