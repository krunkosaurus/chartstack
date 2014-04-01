/* global chartstack */
// Data normalizing adaper for keen.io API.

chartstack.addAdapter('api.keen.io', {
  piechart: function(data){

    console.log('data', data);

    var b = new chartstack.diver(data.result, {
      cols: {
        fixed: ['Browser', 'Share']
      },
      rows: {
        index: 'platform',
        cells: 'result'
      }
    });

    return {
      data: b.table,
      extras: {}
    };
  },

  barchart: function(data){
    data = new chartstack.diver(data.result, {
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
    console.log('data', data);
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


    data = new chartstack.diver(data.result, diverFormat);

    console.log('diver format data', data);

    return {
      data: data.table,
      extras: {}
    };
  }
});

