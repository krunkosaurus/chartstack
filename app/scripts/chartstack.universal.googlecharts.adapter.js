/* global chartstack */

chartstack.addAdapter('google', {
  piechart: function(data){
    return new google.visualization.arrayToDataTable(data);
  },

  barchart: function(data){
    return google.visualization.arrayToDataTable(data);
  },

  linechart: function(data){
    return google.visualization.arrayToDataTable(data);
  }
});