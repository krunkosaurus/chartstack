/* global chartstack */

chartstack.addAdapter('nv', {
  piechart: function(data){
    var ar = [];

    chartstack.each(data, function(item){
      var entry = {
        label: item[0],
        value: item[1]
      };
      ar.push(entry);
    });
    return ar;
  },

  barchart: function(data){
    var each = chartstack.each;
    var ar = [];

    each(data, function(item){
      var o = {
        key: item.name,
        values: []
      }

      each(item.data, function(v, i){
        o.values.push({
          x: i,
          y: v
        });
      });

      ar.push(o);
    });

    return ar;
  },

  linechart: function(data){
    var each = chartstack.each;
    var ar = [];
    each(data, function(item){
      var o = {
        key: item.name,
        values: []
      }

      each(item.data, function(v, i){
        o.values.push([i, v]);
      });

      ar.push(o);
    });

    return ar;
  }
});
