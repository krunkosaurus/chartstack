/* global google, chartstack */
(function(cs){
  cs.addRenderSet({
    name: 'Highcharts',
    namespace: 'Highcharts',

    // Adapts data from UD format to library format.
    adapter: {
      piechart: function(data){
        data = data.data;
        var headers = data.shift();

        return {
          type: 'pie',
          name: headers.join(' '),
          data: data
        };
      },

      barchart: function(data){
        data = data.data;

        var each = cs.each;
        var section = [];
        var colomnKeys = data.shift();
        var rowDescription = colomnKeys.shift();
        var categories = [];

        // Prep rows
        each(colomnKeys, function(name){
          section.push({
            name: name,
            data: []
          });
        });

        each(data, function(selection){
          categories.push(selection.shift());
          each(selection, function(y, a){
            section[a].data.push(y);
          });
        });

        return {
          result: section,
          options: {
            categories: categories,
            rowDescription: rowDescription
          }
        };
      },

      linechart: function(data){
        data = data.data;

        var each = cs.each;
        var section = [];
        var colomnKeys = data.shift();
        var rowDescription = colomnKeys.shift();
        var categories = [];

        // Prep rows
        each(colomnKeys, function(name){
          section.push({
            name: name,
            data: []
          });
        });

        each(data, function(selection){
          categories.push(selection.shift());
          each(selection, function(y, a){
            section[a].data.push(y);
          });
        });
        return {
          result: section,
          options: {
            categories: categories,
            rowDescription: rowDescription
          }
        };
      }
    },

    // Renders DOM charts.
    render: {

      piechart: function($chart, data){
        return new Highcharts.Chart({
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
        return new Highcharts.Chart({
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
            title: {
              text: data.options.rowDescription
            },
            labels: {
              // format: '{value:%m-%d}'
            },
            categories: data.options.categories
          },
          yAxis: {
            min: 0,
            title: {
              align: 'high'
            },
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
        return new Highcharts.Chart({
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
            categories: data.options.categories,
            title: {
              text: data.options.rowDescription
            }
          },
          yAxis: {
            title: {
              // text: 'Temperature (°C)'
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
    }
  });

})(chartstack);
