/* global chartstack */

chartstack.addAdapter('google', {
  piechart: function(data){
    var gdata = new google.visualization.DataTable();
    gdata.addColumn('string', 'Category');
    gdata.addColumn('number', 'Amount');
    gdata.addRows(data);

    return gdata;
  },

  barchart: function(data){
  },

  linechart: function(data){
  }
});
