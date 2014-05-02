---
layout: post
title: Evolution of the Chartstack JS API
---

### Previous state

In the beginning our Chartstack JavaScript API looked like this:

{% highlight js %}
var bartchart = new chartstack.Chart({
  el: document.getElementById('barchart'),
  library: 'nvd3',
  chartType: 'barchart',
  datasource: 'api/keen/barchart.json',
  provider: 'api.keen.io',
  width: '500',
  height: '300'
});
{% endhighlight %}
<center>Figure 1: _Original API_</center>

it was good in that it was simple and easy to understand and followed the philosophy that for convienience charting library differences can be abstracted away so much that the library type is merely a variable. Using our API, all code is the same across all libraries.

While it did accomplish some huge feats internally the downside of this approach is that it didn't allow a lot of flexibility or much advanced scripting such as hooking into/triggering events that are happening in the charts or nice features like filtering and muxing of data.

### Current state

Thanks to a lot of amazing work by [@dustinlarimer](https://github.com/dustinlarimer) our Chartstacks code now looks like this:

{% highlight js %}
var chart = new chartstack.Chart({
  dataset: new chartstack.Dataset({
    adapter: 'keen-io',
    dateformat: 'MM-DD',
    url: '../api/keen/multilinechart.json'
  }),
  view: new chartstack.GoogleCharts.ColumnChart({
    title: 'Column chart',
    el: document.getElementById('traffic-growth'),
    height: '300',
    isStacked: true
  })
});
{% endhighlight %}
<center>Figure 2: _Current API_</center>

This is highly flexible compared to our old key/value approach.  `View` and `Data` classes can be instantiated directly or customized before or after being passed into the main `Chart` class.  `Data` and `View` have a clear separation of responsibilities and both classes also support subscribing/triggering events on them.

### Future state

In this architecture however the `Chart` class isn't doing much of anything except being a container for the `View` and `Data` classes.

If we consider that the `View` class has a hard dependency on `Data` - it physically can't function without it, then perhaps the `Data` object should really be a property of the `View`. The `View` class already has a `.data` property which is essentially the processed data from the `Data` class.  The `Data` class can live on its own but in our view's case, it should be a property of the view:

{% highlight js %}
var chart = new chartstack.Chart({
  view: new chartstack.GoogleCharts.ColumnChart({
    title: 'Column chart',
    el: document.getElementById('traffic-growth'),
    height: '300',
    isStacked: true,
    dataset: new chartstack.Dataset({
      adapter: 'keen-io',
      dateformat: 'MM-DD',
      url: '../api/keen/multilinechart.json'
    })
  })
});
{% endhighlight %}
<center>Figure 3: _Data class nested in View_</center>

Because `chartstack.Chart` still isn't really doing anything but holding the `View` we should just move the `View` class to the top level.  Chartstack is a visual tool and the `View` is essentially the boss.  To do this however, we must make the `library` and `chartType` properties config options of the view (which you'll note is essentially the same as it was doing before, just in a different format).  This also follows inline with the philosophy that the underlying charting library is but a config option in our consistent graphing API:

{% highlight js %}
var chart = new chartstack.Chart({
  chartType: 'columnChart',
  library: 'GoogleCharts',
  title: 'Column chart',
  el: document.getElementById('traffic-growth'),
  height: '300',
  isStacked: true,
  dataset: new chartstack.Dataset({
    adapter: 'keen-io',
    dateformat: 'MM-DD',
    url: '../api/keen/multilinechart.json'
  })
});
{% endhighlight %}
<center>Figure 4: _View as main class_</center>

This looks much cleaner but after much though we find that the emphasis of the chart type is kind of lost in the configuration options.  While the chart library is philosophically unimportant _the type of chart is the most important part of what the user wants_. Making the chart type a direct subclass of the `Chart` class makes a lot of sense.

Additionally, because we default to Google Charts, specifying a library should not be required unless you pick something other than Google Charts.  The API code now looks something like this:

{% highlight js %}
var chart = new chartstack.columnChart({
  title: 'Column chart',
  el: document.getElementById('traffic-growth'),
  height: '300',
  isStacked: true,
  dataset: new chartstack.Dataset({
    adapter: 'keen-io',
    dateformat: 'MM-DD',
    url: '../api/keen/multilinechart.json'
  })
});
{% endhighlight %}
<center>Figure 5: _ChartType class as subclass of main Chart class_</center>

This example is super clean but one might ask what if multiple graphing libraries are loading in the same kind of chartType. Internally we just locate the correct one specified by the library choice (defaulting to Google Charts).  Our final "perfect" API signature is almost complete except a few more considerations.

First, as discussed and unanimously agreed upon we really need to add a `.draw` or `.render` method to our charts because they shouldn't just draw themselves on class instantiation.  People might want them to be drawn on a certain event, etc. Because one of our main tenants of Chartstack is to be simple to understand by everyone, we will go with `.draw`.

Second, the new `Dasaset` class is super powerful but not always required.  I'm certain in 8/10 cases where people just want to paste embed codes, users just want to link to some data source and maybe specify an adapter if one is needed for transformation.  They aren't harnessing the `Data.filter` and other useful constructs that we support.  To simplify this we can allow shorter embeds:

{% highlight js %}
var chart = new chartstack.columnChart({
  title: 'Column chart',
  el: document.getElementById('traffic-growth'),
  height: '300',
  isStacked: true,
  url: '../api/keen/multilinechart.json',
  adapter: 'keen-io'
}).draw();
{% endhighlight %}
<center>Figure 6: _Supporting optional Data class abstraction_</center>

In this example when a new columnChart class (child class of `chartstack.View`) is instantiated it first checks if a `Dataset` object is passed.  If none is found we do a quick check for `url` or `adapter` properties and instantiate a new `Dataset` class from it internally.  The resulting `.data` object is the same as if it was passed like normal.  For those wanting more complexity, passing in a `Dataset` object during class instantiation still works.  The option is there.

Lastly, to make the code simpler we can make the `new` operator optional.  Did you know that when you make a jQuery call, jQuery is actually canceling the call and recalling itself with `new jQuery` internally?  Like jQuery, `chartstack.columnChart` is simply a factory pattern and we can support the same thing with one additional line of code internally.  The resulting end code looks like Figures 7 (simple) and 8 (complex):

{% highlight js %}
var chart = chartstack.columnChart({
  title: 'Column chart',
  el: document.getElementById('traffic-growth'),
  height: '300',
  isStacked: true,
  url: '../api/keen/multilinechart.json',
  adapter: 'keen-io'
}).draw();
{% endhighlight %}
<center>Figure 7: _Final embed code without optional new operator (simple)_</center>

{% highlight js %}
var chart = chartstack.columnChart({
  title: 'Column chart',
  el: document.getElementById('traffic-growth'),
  height: '300',
  isStacked: true,
  dataset: chartstack.Dataset({
    adapter: 'keen-io',
    dateformat: 'MM-DD',
    url: '../api/keen/multilinechart.json'
  })
}).draw();
{% endhighlight %}
<center>Figure 8: _Final embed code without optional new operator (complex)_</center>

Here in Figure 9 we have a more complex scenario one can do with this final API:

{% highlight js %}
var data = chartstack.Dataset({
  adapter: 'keen-io',
  dateformat: 'MM-DD',
  url: '../api/keen/multilinechart.json'
)}
  .filter('rows 1-3')
  .filter('columns 1-99')
  .poll(20000)
  .on('error', function(){
    this.view.trigger('freeze');
    this.view.popNotice('API down.');
  }

var chart = chartstack.columnChart({
  title: 'Column chart',
  el: document.getElementById('traffic-growth'),
  height: '300',
  width: '400',
  dataset: data
})

document.getElementById(trafficTab').addEventListener('click', function(){
   chart.draw();
});
{% endhighlight %}
<center>Figure 9: _Final embed code (super complex example 1)_</center>

That's concludes the idea of further evolving the Chartstack API into its final form.  Let me know your thoughts.
