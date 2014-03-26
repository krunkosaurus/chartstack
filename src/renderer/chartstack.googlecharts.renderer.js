/* global google, chartstack */
chartstack.addRenderer('google', {

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
    var chart, options;

    options = {
      title: $chart.title || '',
    };

    chart = new google.visualization.BarChart($chart.el);
    chart.draw(data, options);
  },

  linechart: function($chart, data){
    var chart, options;

    options = {
      title: $chart.title || '',
    };

    chart = new google.visualization.LineChart($chart.el);
    chart.draw(data, options);
  }

});
