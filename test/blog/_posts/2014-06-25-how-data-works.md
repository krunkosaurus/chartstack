---
layout: post
title: How data works in the model (proposal)
---

Model objects control the entire flow of data inside Chartstack. In addition to storing data, models support the following three major feature categories through the use of various methods, properties, and events.

### Feature categories
1. **FETCHING/POLLING:** Fetching and optionally polling data from a URL. This includes continuously reapplying transformations to polled data.
2. **TRANSFORMING/NORMALIZING:** Optionally transforming data from propietary schema formats to Chartstack Data Format if needed (via an adapter instance). Optionally transforming from other data formats such as CSV or XML to Chartstack Data Format which is JSON (via built-in transformer instances).
3. **REDUCING/ADDING/OPERATING ON:** Support for live operating on data with subtractive methods like `.filterRow()` and additive methods like `.addColumn()`. Support for resetting back to the original data without refetching from the original data source via `.reset()`.

(At the bottom of this entry is a list of all methods, properties, and events.)

In order to support the above features the model keeps two references to its data:

### Two data properties
1. `.originalData` - The original, unprocessed data passed in via `.fetch()` (remote data)  or `.set()` (inline data).
2. `.data` - A copy of `.originalData` used in live operations.  This data is automatically converted to Chartstack Data Format on `.init()` and during polling if an adapter instance is also specified.  At any time `.reset()` can be called to get a fresh, normalized copy of `.originalData`.

{% highlight js %}
  var d = new chartstack.Model();
  d.set([
    ["Year", "Sales", "Expenses"],
    ["2004",  1000,      400],
    ["2005",  1170,      460],
    ["2006",  660,       1120],
    ["2007",  1030,      540]
  ])
    .onlyRow('Sales')
    .init();
    // .reset();
{% endhighlight %}
<center>Figure 2: _Filtering data to support a piechart view with optional reset shown._</center>


### List of model properties and methods

Properties

- **originalData** (internal)
- **data**
- **url**
- **adapter**
- **pollInterval**

Methods

- **init** - init must be manually triggered (or is automatically triggered by the view if the model is nested in a view.  It will do some model checks including:
  - Copy `.data` to `.originalData` if it is blank.
  - Lastly, call `.fetch()` if `.url` is specified.
- **fetch** - Checks for `.url` property and retrieves data via ajax placing data in `originalData` than triggering `originalUpdate` event.
- **set** - Manually set data on the model. This data will be placed in `.originalData` and `originalUpdate` event is triggered.
- **startPoll**
- **stopPoll**
- **filterRow**
- **filterColumn**
- **onlyRow**
- **onlyColumn**
- **addRow**
- **addColumn**

Events

- **init**
- **update**
- **originalUpdate** - This event is triggered whenever `.originalData` property is updated (generally by `.fetch()` or `.set()`).  One library callback is attached to this event to check for an adapter and if so copy a normalized version of `.originalData` to `.data` or else just an exact copy.
- **error** - This event is triggered whenever there is an error. Currently the errors are:
  - if `.fetch` fails due to bad http request.

Events flow:
- Load data from across the internet from .url
- place in .rawData property
- trigger .rawUpdate event


### Test cases to completely test all data features:
Fetch test cases:

1. Fetch URL (chartstack format)
2. Fetch URL (non-chartstack format) SHOULD FAIL GRACEFULLY
3. Fetch URL (non-chartstack format) with proper adapter

Polling test cases:

1. Fetch URL with polling (chartstack format)
2. Fetch URL with polling (non-chartstack format) SHOULD FAIL GRACEFULLY and stop polling.
3. Fetch URL with polling (non-chartstack format) with proper adapter.

Other poll test cases:

1. Stop polling via `.stopPoll`.
2. Start polling again via `.startPoll`.
3. Start polling data after `.fetch` (polling not initially set).
4. Stop polling via `.stopPoll`.
5. Gracefully skip bad fetch and resume polling after encountering http error.
6. Ensure that a  loaded adapter operates after every poll.
7. Ensure that settings like `.filterRow` repeat after every poll.

Preloading data tests:

1. Preload data with chartstack-format data and run `.init`.
2. Preload data with non-chartstack format and run `.init`. POSSIBLE ERROR
3. Preload data with non-chartstack format and adapter and run `.init`.
4. Preload data with chartstack-format data and then also poll url afterwards.
5. Preload data with non-chartstack-format data and then also poll url afterwards. POSSIBLE ERROR
6. Preload data with non-chartstack-format data and adapter and then also poll url afterwards.

Operating on data tests:

1. Reduction tests using preloaded charstack-format data: `.filterRow`, `.filterColumn`, `.onlyRow`, `.onlyColumn`.  Converting  data format to the next lower level: metric, time slice, time series, multi-time series.
2. Test support for `.reset`.

Addition tests:

1. `.appendRow`, `.appendColumn`.
2. `.merge`.
3. `.reset`.
