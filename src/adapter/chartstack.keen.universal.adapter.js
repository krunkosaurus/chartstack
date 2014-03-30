/* global chartstack */
// Data normalizing adaper for keen.io API.
(function(){

  function normalize(data){
    data = data.result;
    var hasTimeFrame = data[0].timeframe ? 1 : 0;
    var hasSeries = data[0].value instanceof Array ? 1 : 0;
    var newHeader;
    var newBody = [];
    var oldKey;
    var each = chartstack.each;

    if (hasTimeFrame){
      newHeader = ['date'];
      if (hasSeries){
        oldKey = Object.keys(data[0].value[0])[0];

        each(data[0].value, function(item){
          var newKey = item[oldKey];
          newHeader.push(newKey);
        });

        each(data, function(item){
          var row = [];
          var startDate = new Date(item.timeframe.start);
          row.push(startDate);
          each(item.value, function(a){
            row.push(a.result);
          });
          newBody.push(row);
        });
      }else{
        newHeader.push('value');
        each(data, function(item){
          newBody.push([new Date(item.timeframe.start), item.value]);
        });
      }
    }else{
      // Assuming pie chart data
      // Set header
      newHeader = Object.keys(data[0]);

      each(data, function(a){
        var entry = [a[newHeader[0]], a[newHeader[1]]];
        newBody.push(entry);
      });
    }

    newBody.unshift(newHeader);
    return newBody;
  }

  chartstack.addAdapter('api.keen.io', {
    piechart: function(data){
      return {
        data: normalize(data),
        extras: {}
      };
    },

    barchart: function(data){
      return {
        data: normalize(data),
        extras: {}
      };
    },

    linechart: function(data){
      return {
        data: normalize(data),
        extras: {}
      };
    }
  });

})();
