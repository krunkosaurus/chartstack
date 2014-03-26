/* global chartstack */

chartstack.addAdapter('nv', {
  piechart: function(data){
    var ar = [];

    // Pop off unused header array.
    data.shift();

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
    var section = [];
    var colomnKeys = data.shift();
    var rowDescription = colomnKeys.shift();

    // Prep rows
    each(colomnKeys, function(name){
      section.push({
        key: name,
        values: []
      });
    });

    each(data, function(selection){
      var rowDesc = selection.shift();
      each(selection, function(y, a){
        section[a].values.push({
          x: rowDesc,
          y: y
        });
      });
    });

    return {
      result: section,
      options: {
        rowDescription: rowDescription
      }
    };
  },

  linechart: function(data){
    var each = chartstack.each;
    var section = [];
    var colomnKeys = data.shift();
    var rowDescription = colomnKeys.shift();

    // Prep rows
    each(colomnKeys, function(name){
      section.push({
        key: name,
        values: []
      });
    });

    each(data, function(selection){
      var rowDesc = selection.shift();
      each(selection, function(y, a){
        section[a].values.push([rowDesc, y]);
      });
    });

    return {
      result: section,
      options: {
        rowDescription: rowDescription
      }
    };
  }
});
