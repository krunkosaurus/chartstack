/* global chartstack */
// Data normalizing adaper for keen.io API.
(function(cs){
  var each = cs.each;

  cs.addAdapter('keen-io', function(response){
    var data, map = this.map || false;
    //console.log("map", map);

    // Default Response Map
    if (!map) {

      map = {
        root: "result",
        each: {}
      };

      if (response.result instanceof Array) {

        if (response.result[0]['value']){

          if (response.result[0]['value'] instanceof Array) {
            // Interval + Group_by

            // Get value (interval result)
            map.each.value = "value -> result";

            // Get label (group_by field)
            for (var key in response.result[0]['value'][0]){
              if (key !== "result") {
                map.each.label = "value -> " + key;
                break;
              }
            }

          } else {
            // Interval, no Group_by
            // Get value
            map.each.value = "value";
          }
        }

        if (response.result[0]['timeframe']) {
          // Get index (start time)
          map.each.index = "timeframe -> start";
        }

        if (response.result[0]['result']) {
          // Get value (group_by)
          map.each.value = "result";
          for (var key in response.result[0]){
            if (key !== "result") {
              map.each.index = key;
              break;
            }
          }
        }

      } else {
        // 1 result (metric)
        // { result: 2450 }
        map.each.index = "";
        map.each.value = "result";
      }
      //console.log(map);

    }

    data = new cs.dataform(response, map);
    return data.table;
    /*return {
      data: data.table,
      extras: {}
    };*/
  });


  // -----------------------
  // -----------------------
  // -----------------------


  cs.addAdapter('api.keen.io', {
    piechart: function(data){
      data = new cs.diver(data.result, {
        cols: {
          fixed: ['Browser', 'Share']
        },
        rows: {
          index: 'platform',
          cells: 'result'
        }
      });

      return {
        data: data.table,
        extras: {}
      };
    },

    barchart: function(data){
      data = new cs.diver(data.result, {
        cols: {
          fixed: ['Date'],
          cells: 'value -> platform'
        },
        rows: {
          index: 'timeframe -> start',
          cells: 'value -> result',
          transform: {
            0: function(value){
              return new Date(value);
            }
          }
        }
      });

      return {
        data: data.table,
        extras: {}
      };
    },

    linechart: function(data){
      var diverFormat;

      if(data.result[0].value instanceof Array){
        diverFormat = {
          cols: {
            fixed: ['Date'],
            cells: 'value -> platform'
          },
          rows: {
            index: 'timeframe -> start',
            cells: 'value -> result',
            transform: {
              0: function(value){
                return new Date(value);
              }
            }
          }
        }
      }else{
        diverFormat = {
          cols: {
            fixed: ['Date', 'Value']
          },
          rows: {
            index: 'timeframe -> start',
            cells: 'value',
            transform: {
              0: function(value){
                return new Date(value);
              }
            }
          }
        }
      }

      data = new cs.diver(data.result, diverFormat);

      return {
        data: data.table,
        extras: {}
      };
    }
  });
})(chartstack);
