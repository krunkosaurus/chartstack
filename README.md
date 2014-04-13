# Chartstack

[![Build Status](https://magnum.travis-ci.com/keenlabs/chartstack.svg?token=wfasM9dDfjzGTx53pqzt&branch=feature/testrunner)](https://magnum.travis-ci.com/keenlabs/chartstack)

**Chartstack** is a charting library and abstraction layer that enables a user to visualize their data on top of many popular charting libraries using one unified JavaScript API. Chartstack's goal is to allow any data format to work with any charting library, including an easy way to support your own custom data formats. Charstack is created and maintained by [Keen IO](http://keen.io/).

Key features:
- A unified JavaScript charting API that works across a growing list of popular charting libraries. (Currently [NVD3](http://nvd3.org/) and [Google Charts](https://developers.google.com/chart/))
- A plugin architecture to transform data into a unified format and a rendering plugin system so that charting libraries understand it.
- An optional "easy embed" API that extends HTML with new simple yet powerful charting elements like &lt;piechart> and &lt;barchart>.

## Demos

These demos are non-fancy for now but demonstrate pulling in standard and non-standard data against all supported charting libraries:
* [Chartstack Official Demo Page](http://keenlabs.github.io/chartstack/)
* [Additional JS API Demos](http://keenlabs.github.io/chartstack/js-api-demo/)
* [Additional DOM API Demos](http://keenlabs.github.io/chartstack/dom-api-demo/)
* [Fitbit CSV data example page](http://keenlabs.github.io/chartstack/fitbit/)

## How does Chartstack work?

**The Unified Chart Data Format**

Chartstack is built around the concept that all data APIs are arbitrary and all charting libraries require data formatted in different ways to work. There is no standard in either one of these areas.  If we could make even one of these unified the other problem would be a lot easier to solve. Since we can't get all charting frameworks to agree on the same data API we've create the [**Unified Chart Data Standard Format**](https://github.com/keenlabs/chartstack/wiki/Unified-Chart-Data-Format) to serve as a portable transformation layer.  The **UCDS** format is based on the [Google Charts API](https://developers.google.com/chart/interactive/docs/reference) and describes what data should look like for various chart types (Pie, Bar, Line, etc) in a clean and easy to understand way.

For most users of Chartstack, understanding the **DOM embed API** or the **JavaScript API** and the **UCDS** format is all one needs to know to get started rendering charts.  For those that want Chartstack to understand your own unique data format / API or for getting Chartstack to understand support a new charting library, understanding the layers beneath DOM and JS API is relevant.

**The three layers of Chartstack**

1. **Adapters:** Adapters normalize data into **UCDS** format.  A [Keen adapter](src/adapter/chartstack.keen.universal.adapter.js) for all data coming from http://api.keen.io is included in this repo.
2. **Renderers:** Renderer plugins understands how to render to each supported charting library using the **UCDS** format. Here is an example of the [NVD3 renderer](src/renderer/chartstack.nvd3.renderer.js).
2. **Chartstack core:** Holds and controls the flow of both *1.* and *2.* and supplies convenience methods useable in each plugin type.

## How to install

There are three ways to install.

#### Developer version with demos and test suite:

- Clone the repo: `git clone https://github.com/keenlabs/chartstack.git`.
- Run `npm install` to setup Grunt and node packages it uses in tasks.
- Run `bower install` to install 3rd party JS libraries.
- Run `grunt` to launch the web server and view the demos. [http://localhost:9001/demo/](http://localhost:9001/demo/).

#### Grab just the minified Chartstack file:
- [Download the latest release](https://github.com/keenlabs/chartstack/releases/download/v0.0.1/chartstack.min.js) (1.58 kB gzipped)
- You must include your favorite charting library above chartstack.min.js and it will be autodetected.

#### Install directly into your project with [Bower](http://bower.io):
- `bower install chartstack` in your project folder will download Chartstack and all supported charting libraries in to your `bower_components` folder.
- Feel free to delete the charting libraries you do not want to use.
- You can reference the uncompressed chartstack files (in `chartstack/src`) or just the compressed file (in `chartstack/dist`).

## Documentation

Visit the Chartstack wiki [here](https://github.com/keenlabs/chartstack/wiki).

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
2. Then run `npm install` in the root of this project. npm will look at [package.json](https://github.com/keenlabs/chartstack/blob/master/package.json) and automatically install the necessary local dependencies listed there.

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

Have a bug or a feature request? If your problem or idea is not addressed yet, [please open a new issue](https://github.com/keenlabs/chartstack/issues/new).

## Support

Need a hand with something? Join us in [HipChat](http://users.keen.io/), [IRC](http://webchat.freenode.net/?channels=keen-io), or shoot us an email at [contact@keen.io](mailto:contact@keen.io)

## Copyright and license

Code and documentation copyright 2014 Keen IO, Inc. Code released under [the MIT license](LICENSE). Docs released under [Creative Commons](LICENSE).
