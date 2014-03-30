/* global chartstack */

chartstack.addAdapter('Highcharts', {
  piechart: function(data){
    data = data.data;
    var headers = data.shift();

    return {
      type: 'pie',
      name: headers.join(' '),
      data: data
    };
  },

  barchart: function(data){
    data = data.data;

    var each = chartstack.each;
    var section = [];
    var colomnKeys = data.shift();
    var rowDescription = colomnKeys.shift();
    var categories = [];

    // Prep rows
    each(colomnKeys, function(name){
      section.push({
        name: name,
        data: []
      });
    });

    each(data, function(selection){
      categories.push(selection.shift());
      each(selection, function(y, a){
        section[a].data.push(y);
      });
    });

    return {
      result: section,
      options: {
        categories: categories,
        rowDescription: rowDescription
      }
    };
  },

  linechart: function(data){
    data = data.data;

    var each = chartstack.each;
    var section = [];
    var colomnKeys = data.shift();
    var rowDescription = colomnKeys.shift();
    var categories = [];

    // Prep rows
    each(colomnKeys, function(name){
      section.push({
        name: name,
        data: []
      });
    });

    each(data, function(selection){
      categories.push(selection.shift());
      each(selection, function(y, a){
        section[a].data.push(y);
      });
    });
    return {
      result: section,
      options: {
        categories: categories,
        rowDescription: rowDescription
      }
    };
  }
});
