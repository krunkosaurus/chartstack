/* global chartstack */
chartstack.addRenderer('Highcharts', {
  prerender: function($chart){
  },

  piechart: function($chart, data){
console.log('data', data);
    // Radialize the colors
    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
      return {
        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
        stops: [
          [0, color],
          [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
        ]
      };
    });

    var chart1 = new Highcharts.Chart({
      chart: {
        renderTo: $chart.el,
        type: 'pie',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
      },
      title: {
        text: 'Browser market shares at a specific website, 2010'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
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
        name: 'Browser share',
        data: [
          ['Firefox',   45.0],
          ['IE',       26.8],
          ['Chrome', 12.8],
          ['Safari',    8.5],
          ['Opera',     6.2],
          ['Others',   0.7]
        ]
      }]
    });
  },

  barchart: function($chart, data){
  },

  linechart: function($chart, data){
  }

});
