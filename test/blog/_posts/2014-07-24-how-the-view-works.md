---
layout: post
title: The view class (full spec proposal)
---

View objects handle visualizing your data in an HTML document using one standard API on top of any myriad of supported 3rd party visualization libraries.  Whatever you choose, the API remains largely the same.

Views support the following three major feature categories through the use of various methods, properties, and events.

### Feature categories
1. **Transforming data:** Behind the scenes a chartstack view transform chartstack model data to 3rd party chart library formats.  Every charting library requires data to be formatted in different ways and Chartstack knows how.
2. **Rendering HTML**: Some chart libraries use HTML5 canvas while others use SVG or even flash.  Chartstack knows the correct way to render a chart in the HTML DOM.
3. **Standardized styling & formatting:** The views styling and formatting API is largely the same across charting libraries enabling a user to control chart colors, backgrounds, and even formatting text content without considering the uderlying visualization framework.  The options for styling a pie chart using Google Charts or a scatter chart using NVD3 is essentially the same.

(At the bottom of this entry is a complete list of all methods, properties, and events present in the model class.)

### List of model properties, methods, and events

**Properties**

- **.el** - (ELEMENT or STRING) The HTML element to render the chart in to.  If a string is passed it will be searched for in the DOM using `document.getElmentById()`.
- **.library** - (STRING) The charting library to render the chart in. Defaults to Google Charts if this option is not passed.

**Content Properties**

- **.title** - (STRING) The title of the chart. Note that not all charting libraries support this feature.

**Size Properties**

- **.width** - (STRING or INTEGER) Pixels to render the width. Defaults to 800.
- **.height** - (STRING OR INTEGER) Pixels to render the height. Defaults to 600.

**Display Properties**
- **.labels** - (BOOLEAN) Decides whether to enable labels. Defaults to true.

**Style Properties**

- **.backgroundColor** - (STRING) Background color of the chart. Defaults to 'white'.
- **.titleTextColor** - (STRING) Color of the title. Defaults to 'black'. Not all charts support a title.
- **.legendColor** - (STRING) Color of the legend text. Defaults to black.
- **.pieSliceBorderColor** - (STRING) Color of the borders of a pie chart. Defaults to black.
- **.pieSliceTextColor** - (STRING) Color of pie chart text. Default to black.
- **.colors** - (ARRAY) An array of colors to use in a pie, chart. Note that colors will repeat if there are more data elements than colors in the array. Defaults to ['red', 'green', 'yellow', 'blue', 'orange'].

**Special Properties**

- **.libOptions** - (OBJECT) Options to be passed directly to the 3rd party charting library. This is useful in cases that aren't covered in Chartstack's standard API. For example Google Chart's Piechart have a {is3d : true} options.

** Other properties **
- **.model** - (MODEL INSTANCE) - model instance the view references data from.
- **.chartType** - (STRING) - type of chart (usually set internally by proxy chart methods. (example: new chartstack.lineChart()).

**Methods**

- **.draw()** - This method triggers the chart to be rendered in to the HTML.  `.draw()` triggers a `.fetch()` on the nested model if the model does not contained inline data.
- **.formatRowLabel()** - Allows the row label in a chart to be formatted.  When executed, each raw label is passed to be edited. The formatted label must be returned.
- **.formatColumnLabel()** - Allows the column label in a chart to be formatted.  When executed, each raw label is passed to be edited. The formatted label must be returned.
- **.freeze()** - Freezes the current chart into a JPG or PNG file. This is good for speeding up a page full of charts or allowing the user to download a rendered version of any chart.
- **.unfreeze()** - Removed the static JPG or PNG version of the chart and rerenders the chart.
- **.download()** - Triggers an immediate download of the chart.

**Events**

- **error** - Triggered whenever an error occurs related to a view.

### Flow descriptions

## chartstack initialization / dom-ready flow

- Before Chartstack script is ran all 3rd party charting libraries you want to use should be included in scripts above chartstack so that they are ready to use.
- If Google Charts is being used, no script tag is required as its the default library and is loaded dynamically.
- If not planning to use Google Charts set `chartstack.View.defaults.library` to another chart library option that you have loaded.
- At the bottom of chartstack.core.js there is `bootstrap()` call which:
  - Iterates across registered libraries and sets a flag if each registered chart lib is loaded (by checking the registered namespace) on the page. If the registered lib has a `.loadLib` method, it is executed to load the lib dynamically.
  - To test: If rendering charts other than Google Charts, we shouldn't load the Google Charts.
