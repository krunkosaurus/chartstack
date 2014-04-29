/* global chartstack */
// Data normalizing adaper for keen.io API.
(function(cs){
  var each = cs.each;

  cs.addAdapter('keen-io', function(response){
    var self = this, data; //, output;
    var schema = self.schema || false;
    //var response = { result: 2450 };

    // Default Response Map
    if (!schema) {

      schema = {
        collection: "result",
        unpack: {}
      };

      if (response.result instanceof Array) {

        if (response.result.length > 0 && response.result[0]['value'] !== void 0){

          if (response.result[0]['value'] instanceof Array) {
            // Interval + Group_by

            // Get value (interval result)
            schema.unpack.value = "value -> result";

            // Get label (group_by field)
            for (var key in response.result[0]['value'][0]){
              if (key !== "result") {
                schema.unpack.label = "value -> " + key;
                break;
              }
            }

          } else {
            // Interval, no Group_by
            // Get value
            schema.unpack.value = "value";
          }
        }

        if (response.result.length > 0 && response.result[0]['timeframe']) {
          // Get index (start time)
          schema.unpack.index = {
            path: "timeframe -> start",
            type: "date",
            //format: "MMM DD"
            method: "moment"
          };
        }

        if (response.result.length > 0 && response.result[0]['result']) {
          // Get value (group_by)
          schema.unpack.value = "result";
          for (var key in response.result[0]){
            if (key !== "result") {
              schema.unpack.index = key;
              break;
            }
          }
        }

        if (response.result.length > 0 && typeof response.result[0] == "number") {
          schema.collection = "";
          schema.unpack.index = "steps -> event_collection";
          schema.unpack.value = "result -> ";
        }

        if (response.result.length == 0) {
          schema = false;
          //data
        }


      } else {
        // Metric: { result: 2450 } -> [['result'],[2450]]
        delete schema.unpack;
        schema = {
          collection: "",
          select: [
            {
              path: "result",
              type: "number",
              label: "Metric",
              format: "1,000.00"
            }
          ]
        }
      }

    }

    if (schema) {
      data = new cs.Dataform(response, schema);
      //output = data;
    }

    // data = new cs.dataform(response, schema);
    // output = data.table;

    // Date formatting
    /*
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
    */
    //console.log(data);
    return data;
  });

})(chartstack);
