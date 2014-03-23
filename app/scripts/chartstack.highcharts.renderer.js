/* global chartstack */
chartstack.addRenderer('Highcharts', {
  init: function($chart){
  },

  piechart: function($chart, data){
    var chart1 = new Highcharts.Chart({
      chart: {
        renderTo: $chart.el,
        type: 'pie',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
      },
      title: {
        text: $chart.title || ''
      },
      //tooltip: {
      //  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      //},
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            color: '#000000',
            connectorColor: '#000000',
            formatter: function() {
              return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
            }
          }
        }
      },

      series: [{
        type: 'pie',
        // name: 'Browser share',
        data: data
      }]
    });
  },

  linechart: function($chart, data){
  },

  barchart: function($chart, data){
  }

});
