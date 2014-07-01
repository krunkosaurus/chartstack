---
layout: post
title: The data model class (full spec proposal)
---

Model objects control the entire flow of data inside Chartstack. In addition to storing data, models support the following three major feature categories through the use of various methods, properties, and events.

### Feature categories
1. **Setting/getting/resetting data:** Data can be set by passing in a data literal during model creation or after the model has already been created via `.set()`. Remote data can be fetched via `.fetch()` and the `.url` property.  Polling for updates is also supported which includes continuously reapplying transformations to polled data. Support for resetting back to the original data without refetching from the original data source via `.reset()`.
2. **Normalizing data:** Support for transforming data from propietary schema formats to Chartstack Data Format via the `.adapter` property which loads an adapter instance. Adapter instances also support built-in transforming from other data types such as CSV or XML to Chartstack Data Format, which is in JSON.
3. **Transforming data:** Support for live operating on data with subtractive methods like `.filterRows()` and additive methods like `.addColumns()`.

(At the bottom of this entry is a complete list of all methods, properties, and events present in the model class.)

In order to support the above features the model keeps two references to its data:

### Two data properties
1. `.originalData` - The original, unprocessed data passed in via `.fetch()` (remote data)  or `.set()` (inline data).
2. `.data` - A copy of `.originalData` used in live operations.  This data has been automatically converted to Chartstack Data Format during the `.originalUpdate` event call.  The data here is also continuously transformed during polling if transforms or/and an adapter is present.  At any time `.reset()` can be called to get a fresh, normalized copy of `.originalData`, and to clear all queued transforms.

### List of model properties, methods, and events

**Properties**

- **.originalData** - (ARRAY) Reference to original passed in data via `.set()` or `.fetch()`. Should never be modified directly.
- **.data** - (ARRAY) Normalized version of `.originalData` which all transforms are applied to during the `.transform` event. Should never be modified directly.
- **.url** - (STRING) HTTP string of where to fetch data source from. Used by `.fetch()` and polling feature.
- **.adapter** - (STRING) Name of Chartstack adapter to perform normalization on this data. Example: 'fitbit'.  The JavaScript file containing this Chartstack adapter must be loaded on the page before `.set()` or `.fetch()` is called.
- **.pollInterval** - (INTEGER) Time in milliseconds to poll for new data from `.url`. Defaults to 0 to not poll.

**Methods**

- **.fetch()** - Checks for `.url` property and retrieves data via ajax. Then uses `.set()` to do the rest of the work.  Also checks `.pollInterval` property to see if `.fetch` needs to be repeated.
- **.set()** - Sets data on the model. This data is placed in `.originalData` and then `originalUpdate` event is triggered to do further work.
- **.pause()** - Pauses polling. To continue simply call `.fetch` again.
- **.clear()** - Removes all queued transforms.
- **.reset()** - Copies a fresh, normalized copy of `.originalData` in to `.data` and clears all queued transforms via `.clear()`. Stops polling.

**Transforming methods**

Transform methods queue under the `.transform` event when called, to be executed any time the model's data is updated. (Internally The `.transform` event is triggered anytime the `.update` event is triggered.)

Deductive transforming methods accept two types of arguments:

1. As an array of row or column titles. Example: `.filterRows(['Sales', 'Expenses'])`.
2. As a string containing comma-separated integers, ranges, or both.  These integers correspond to placement and is 1-based. For example: `.filterRows('1-3,5,7')` means filter out rows 1-3, 5, and 7. Can also specify "\*" for everything after or before a row or column. Example: `.filterRows('1-3,5*')` means filter out rows 1-3 and all rows after 5.

Additive transforming methods accept a single array of nested arrays of columns or rows to add. Example: `.addColumns([['Sales', '300', '682', '855']])`.

To reset all queued transforms call `.clear()` or `.reset()` to both clear and reset the data back to the original, untransformed source.

- **.filterRows()** - Filter rows out of `.data`.
- **.filterColumns()** - Filter columns out of `.data`.
- **.onlyRows()** - Specify only the rows you want to keep and filter everything else.
- **.onlyColumns()** - Specify only the columns you want to keep and filter everything else.
- **.addRows()** - Adding a row of data.
- **.addColumns()** - Adding a column of data.

**Events**

- **originalUpdate** - This event is triggered whenever `.originalData` property is updated (generally by `.set()` or `.fetch()`).  One library callback is attached to this event to check for an adapter and if so copy a normalized version of `.originalData` to `.data` or else just make an exact copy.
- **update** - Runs queued transforms (by triggering `.transform`). If the model is nested in a view, the view automatically binds to this event to rerender a view every time there is a data update.
- **transform** - Trigger all queued transforms. Queued transformed can be cleared with `.clear()` or `.reset()` methods.
- **error** - This event is triggered whenever there is an error. Currently the errors are:
  - if `.fetch()` fails due to bad http request.

### Example workflows

The following are examples of how models are used including the events that are triggered throughout the process of interacting with a model.

**Example 1: Model with set data and transforms**
{% highlight js %}
  var model = new chartstack.Model({
    data: [
      ["Year", "Sales", "Expenses"],
      ["2004",  1000,      400],
      ["2005",  1170,      460],
      ["2006",  660,       1120],
      ["2007",  1030,      540]
    ]
  })
    .onlyRows(['Sales']); // Reduce data to fit pie chart view
{% endhighlight %}

1. On creation, the model checks for passed `.data` argument and uses the `.set()` method on it if it exists. The `.set()` method does the following:
 - Copies data to `.originalData` property.
 - Triggers `.originalUpdate` event.  Important: This trigger is deferred after the current call stack has cleared (setTimeout with a delay of 0) to allow the ability of transform methods to queue before any events are triggered.
2. The triggered `.originalUpdate` event has internal callbacks which do the following:
 - adapter check: Checks for a set `adapter` property. If one is found, uses it to normalize the data.
 - data copy: copies the result to `.data` property.
 - Triggers `.update` event.
3. The `.update` event has one system callback which does the following:
 - triggers a `.transform` event. In our case executing `.onlyRows()` which runs a transformation on our `.data`.
 - If our model is nested inside of a view, the view is auto subscribed to `.update` to rerender itself any time there is a change to our data.

**Example 2: Model with fetch data, adapter, polling, and transforms**
{% highlight js %}
  var model = new chartstack.Model({
    url: 'http://valid/api/123',
    adapter: 'Keen IO',
    pollInterval: 5000
  })
    .fetch()
    .onlyRows('1-3');
{% endhighlight %}

In this example the same flow as above is applied except instead of being passed data on creation the model sits dormant until `.fetch()` is called.  The flow:

 - On instantiation the model checks for `.data` property which is not found.
 - `.fetch()` is called, which fetches data from `.url` and executes `.set()` on it.  It also checks for `.pollInterval` property.  Since it exists fetch sets itself up to recall itself in 5 seconds.
 - `.set()` which was called copies data to the `.originalData` property and triggers `originalUpdate` event.
 - The `.originalUpdate` event checks for a set `adapter`, applies it if it exists, and in either case copies the data to the `.data` property.  It then triggers the `.update` event signifying that new data is ready.
 -  The `.update` event triggers the `.transform` event executing `.onlyRows` functionality and modifying `.data`.
 - Any other subsctibed events to `.update` event is executed.


### Test cases to completely test all data features:
Inline data tests:

1. Inline data with chartstack-format data.
2. Inline data with non-chartstack format SHOULD FAIL GRACEFULLY, SURFACE USEFUL ERROR
3. Inline data with non-chartstack format and adapter.
4. Inline data with chartstack-format data, proper url, and then start poll url afterwards.
5. Inline data with non-chartstack-format data and adapter and then also poll url afterwards.
6. Inline data with non-chartstack-format data and then also poll url afterwards. SHOULD FAIL GRACEFULLY, SURFACE USEFUL ERROR

Operating on data tests:

1. Reduction tests using inline charstack-format data: `.filterRows`, `.filterColumns`, `.onlyRows`, `.onlyColumns`.  Converting  data format to the next lower level: metric, time slice, time series, multi-time series.
2. Empty model with `.set()` tests + transforms.
3. Test support for `.reset`.


Fetch test cases:

1. Fetch URL (chartstack format)
2. Fetch URL (non-chartstack format) SHOULD FAIL GRACEFULLY, SURFACE USEFUL ERROR
3. Fetch URL (non-chartstack format) with proper adapter
4. Fetch bad URL SHOULD FAIL GRACEFULLY, SURFACE USEFUL ERROR

Polling test cases:

1. Fetch URL with polling (chartstack format)
2. Fetch URL with polling (non-chartstack format) SHOULD FAIL GRACEFULLY, SURFACE USEFUL ERROR, AND PAUSE POLLING.
3. Fetch URL with polling (non-chartstack format) with proper adapter.

Other poll test cases:

1. Stop polling via `.stopPoll`.
2. Start polling again via `.fetch`.
3. Gracefully skip bad fetch and resume polling after encountering http error.
4. Ensure that a loaded adapter operates after every poll.
5. Ensure that settings like `.filterRows` repeat after every poll.

Addition tests:

1. `.appendRow`, `.appendColumn`.
2. `.merge`.
3. `.reset`.

### Future functionality

1. `.merge`
2. `.groupBy`
3. `.reorderColumns`
4. `.reorderRows`
