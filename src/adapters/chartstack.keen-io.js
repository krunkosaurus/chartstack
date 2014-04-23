/* global chartstack */
// Data normalizing adaper for keen.io API.
(function(cs){
  var each = cs.each;

  cs.addAdapter('keen-io', function(response){
    var self = this, data, output;
    var map = self.map || false;
    //var response = { result: 2450 };

    // Default Response Map
    if (!map) {

      map = {
        root: "result",
        each: {},
        sort: {
          index: 'asc',
          label: 'desc'
        }
      };

      if (response.result instanceof Array) {

        if (response.result.length > 0 && response.result[0]['value'] !== void 0){

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

        if (response.result.length > 0 && response.result[0]['timeframe']) {
          // Get index (start time)
          map.each.index = "timeframe -> start";
        }

        if (response.result.length > 0 && response.result[0]['result']) {
          // Get value (group_by)
          map.each.value = "result";
          for (var key in response.result[0]){
            if (key !== "result") {
              map.each.index = key;
              break;
            }
          }
        }

        if (response.result.length > 0 && typeof response.result[0] == "number") {
          map.root = "";
          map.each.index = "steps -> event_collection";
          map.each.value = "result -> ";
        }

        if (response.result.length == 0) {
          map = false;
          //data
        }


      } else {
        // Metric: { result: 2450 } -> [['result'],[2450]]
        /*data = {
          table: [['result'], [response.result]],
          series: [{ key: 'result', values: [{ value: response.result }] }]
        };
        output = data.table;*/
        map.each.value = 'result';
      }

    }

    if (map) {
      data = new cs.dataform(response, map);
      output = data.table;
    }

    // data = new cs.dataform(response, map);
    // output = data.table;

    // Date formatting
    if (chartstack.moment) {
      each(output, function(row, i){
        each(row, function(cell, j){
          if (j == 0) {
            if (moment(cell).isValid()) {
              output[i][j] = (self.dateformat) ? chartstack.moment(cell).format(self.dateformat) : new Date(cell);
            }
          }
        });
      });
    }
    //console.log(data);
    return output;
  });

})(chartstack);
