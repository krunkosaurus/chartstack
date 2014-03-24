/* global chartstack */
chartstack.addRenderer('Highcharts', {
  init: function($chart){
  },

  piechart: function($chart, data){
    var chart = new Highcharts.Chart({
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

      series: [data]
    });
  },

  barchart: function($chart, data){
    var chart = new Highcharts.Chart({
      chart: {
        renderTo: $chart.el,
        type: 'bar',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
      },
      title: {
        text: $chart.title || ''
      },
      xAxis: {
        categories: data.options.categories,
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        //title: {
        //  text: 'Population (millions)',
        //  align: 'high'
        //},
        labels: {
          overflow: 'justify'
        }
      },
      //tooltip: {
      //  valueSuffix: ' millions'
      //},
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 100,
        floating: true,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: data.result
    });
  },

  linechart: function($chart, data){
    var chart = new Highcharts.Chart({
      chart: {
        renderTo: $chart.el,
        type: 'line',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
      },
      title: {
        text: $chart.title || '',
        x: -20 //center
      },
      xAxis: {
        categories: data.options.categories
      },
      yAxis: {
        title: {
          text: 'Temperature (°C)'
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      //tooltip: {
      //  valueSuffix: '°C'
      //},
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      series: data.result
    });
  }
});
