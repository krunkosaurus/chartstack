/* global chartstack */
(function(cs){
  cs.addAdapter('nv', {
    piechart: function(data){
      data = data.data;

      var ar = [];

      // Pop off unused header array.
      data.shift();

      cs.each(data, function(item){
        var entry = {
          label: item[0],
          value: item[1]
        };
        ar.push(entry);
      });
      return ar;
    },

    barchart: function(data){
      data = data.data;

      var each = cs.each;
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
      data = data.data;

      var each = cs.each;
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
})(chartstack);
