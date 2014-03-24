/* global chartstack */

// Data normalizing adaper for keen.io API.
chartstack.addAdapter('api.keen.io', {
  piechart: function(data){
    var ar = [];
    var keys = Object.keys(data.result[0]);
    // Set header
    ar.push(keys);

    chartstack.each(data.result, function(a){
      var entry = [a[keys[0]], a[keys[1]]];
      ar.push(entry);
    });
    return ar;
  },

  barchart: function(data){
    var each = chartstack.each;
    var ar = [];
    var keys = Object.keys(data.result[0]);
    var values;

    // TODO: We need to support non-time framed queries
    // like group by + group by.
    if (keys[1] == 'timeframe'){
      values = Object.keys(data.result[0]);
      keys = [];
      each(data.result[0].value, function(prop){
        var key = Object.keys(prop)[0];
        var value = prop[key];
        keys.push(value);
      });

      keys.unshift('date');
    }
    // Set header
    ar.push(keys);

    each(data.result, function(item){
      var slice = [new Date(item.timeframe.start)];
      each(item.value, function(valueObj){
        var keys = Object.keys(valueObj);
        slice.push(valueObj[keys[1]]);
      });
      ar.push(slice);
    });

    return ar;
  },

  linechart: function(o){
    var each = chartstack.each;
    var ar = [];
    var sections = {};

    chartstack.each(o.result, function(a){
      // Iterate through value array.
      var lastTime = new Date(a.timeframe.start);

      each(a.value, function(v){
        var keys = Object.keys(v);

        if (!sections[v[keys[0]]]){
          sections[v[keys[0]]] = {};
          sections[v[keys[0]]].key = v[keys[0]];
          sections[v[keys[0]]].values = [];
        }
        sections[v[keys[0]]].values.push([ lastTime , v[keys[1]] ]);
      });
    });

    each(sections, function(s){
      ar.push(s);
    });

    return ar;
  }
});
