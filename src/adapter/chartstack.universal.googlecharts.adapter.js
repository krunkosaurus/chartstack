/* global google, chartstack */

chartstack.addAdapter('google', {
  piechart: function(data){
    return google.visualization.arrayToDataTable(data.data);
  },

  barchart: function(data){
    return google.visualization.arrayToDataTable(data.data);
  },

  linechart: function(data){
    return google.visualization.arrayToDataTable(data.data);
  }
});
