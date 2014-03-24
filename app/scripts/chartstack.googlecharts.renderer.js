/* global chartstack, nv, d3 */
chartstack.addRenderer('google', {

  init: function($chart){
  },

  piechart: function($chart, data){
    var chart, options;

    // Set chart options
    options = {
      'title': $chart.title || '',
      'width': parseInt($chart.width),
      'height': parseInt($chart.height)
    };

    chart = new google.visualization.PieChart($chart.el);
    chart.draw(data, options);
  },

  barchart: function($chart, data){
  }

});
