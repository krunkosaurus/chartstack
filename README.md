# Chartstack

Chartstack is JavaScript charting library and abstraction layer that enables a user to visualize their data using any of many popular charting libraries that Chartstack supports. Chartstack's goal is to allow any data format to work with any charting library, including your own custom data formats.  Chartstack is made to be easy to use and in addition to a unified JavaScript charting API also includes a dom-centric "easy embed" feature.  Chartstack is open-source and made by the guys and gals at [KEEN IO](https://keen.io/).

Key features:
- A unified JavaScript charting API that works across many popular charting libraries. Lean more here.
- A plugin adapter architecture to transform data into a unified format charting libraries can understand. Lean more here.
- An optional "easy embed" API extends HTML with new simple, yet powerful, charting elements like <piechart> and <barchart>. Lean more here.

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

- [Download the latest release](https://github.com/twbs/bootstrap/archive/v3.1.1.zip).
- Clone the repo: `git clone https://github.com/twbs/bootstrap.git`.
- Install with [Bower](http://bower.io): `bower install bootstrap`.

Read the [Getting started page](http://getbootstrap.com/getting-started/) for information on the framework contents, templates and examples, and more.

### What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

```
bootstrap/
â”œâ”€â”€ css/
â”‚   â”œâ”€â”€ bootstrap.css
â”‚   â”œâ”€â”€ bootstrap.min.css
â”‚   â”œâ”€â”€ bootstrap-theme.css
â”‚   â””â”€â”€ bootstrap-theme.min.css
â”œâ”€â”€ js/
â”‚   â”œâ”€â”€ bootstrap.js
â”‚   â””â”€â”€ bootstrap.min.js
â””â”€â”€ fonts/
    â”œâ”€â”€ glyphicons-halflings-regular.eot
    â”œâ”€â”€ glyphicons-halflings-regular.svg
    â”œâ”€â”€ glyphicons-halflings-regular.ttf
    â””â”€â”€ glyphicons-halflings-regular.woff
```

We provide compiled CSS and JS (`bootstrap.*`), as well as compiled and minified CSS and JS (`bootstrap.min.*`). Fonts from Glyphicons are included, as is the optional Bootstrap theme.



## Bugs and feature requests

Have a bug or a feature request? Please first read the [issue guidelines](https://github.com/twbs/bootstrap/blob/master/CONTRIBUTING.md#using-the-issue-tracker) and search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/twbs/bootstrap/issues/new).

## Documentation

Bootstrap's documentation, included in this repo in the root directory, is built with [Jekyll](http://jekyllrb.com) and publicly hosted on GitHub Pages at <http://getbootstrap.com>. The docs may also be run locally.

## Compiling CSS and JavaScript

Bootstrap uses [Grunt](http://gruntjs.com/) with convenient methods for working with the framework. It's how we compile our code, run tests, and more. To use it, install the required dependencies as directed and then run some Grunt commands.

### Install Grunt

From the command line:

1. Install `grunt-cli` globally with `npm install -g grunt-cli`.
2. Navigate to the root `/bootstrap` directory, then run `npm install`. npm will look at [package.json](https://github.com/twbs/bootstrap/blob/master/package.json) and automatically install the necessary local dependencies listed there.

When completed, you'll be able to run the various Grunt commands provided from the command line.

**Unfamiliar with npm? Don't have node installed?** That's a-okay. npm stands for [node packaged modules](http://npmjs.org/) and is a way to manage development dependencies through node.js. [Download and install node.js](http://nodejs.org/download/) before proceeding.

### Available Grunt commands

#### Build - `grunt`
Run `grunt` to minify all Chartstack JavaScript files to chartstack.min.js in `/dist`. **Uses [UglifyJS](http://lisperator.net/uglifyjs/).**

#### Launch test server - `grunt connect`
Run `grunt connect` to start a test server locally accessible in your web browser at http://localhost:9001/.  This is useful for running the demos which require ajax.

### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

## Support

Need a hand with something? Join us in [HipChat](http://users.keen.io/), [IRC](http://webchat.freenode.net/?channels=keen-io), or shoot us an email at [contact@keen.io](mailto:contact@keen.io)

## Copyright and license

Code and documentation copyright 2014 KEEN IO, Inc. Code released under [the MIT license](LICENSE). Docs released under [Creative Commons](docs/LICENSE).