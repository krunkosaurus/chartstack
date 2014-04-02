/* global chartstack */
// Data normalizing adaper for keen.io API.
(function(cs){
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
