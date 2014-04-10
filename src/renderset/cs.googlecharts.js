/* global google, chartstack */
(function(cs){
  var each = cs.each;

  // -----------------------------
  // Library Namespace
  // -----------------------------

  cs.GoogleCharts = cs.GoogleCharts || {};


  // -----------------------------
  // Type: Pie chart
  // -----------------------------

  cs.GoogleCharts.PieChart = cs.Visualization.extend({
    initialize: function(){
      console.log('pie!', this);
      //this.trigger('error', 'testing pie errors');
    }
  });

  cs.GoogleCharts.BarChart = cs.Visualization.extend({
    initialize: function(){
      console.log('bar!', this);
      //this.trigger('error', 'testing bar errors');
    }
  });

  cs.GoogleCharts.LineChart = cs.Visualization.extend({
    initialize: function(){
      console.log('line!', this);
      //this.trigger('error', 'testing line errors');
    }
  });


  // -----------------------------
  // Register Methods
  // -----------------------------

  cs.Visualization.register("google", {
    "piechart": cs.GoogleCharts.PieChart,
    "barchart": cs.GoogleCharts.BarChart,
    "linechart": cs.GoogleCharts.LineChart
  });


  cs.addRenderSet({
    name: 'Google Charts',
    namespace: 'google',

    // Adapts data from UD format to library format.
    adapter: function(data){
      return google.visualization.arrayToDataTable(data.data);
    },

    // Renders DOM charts.
    render: {
      piechart: function($chart, data){

        if (data instanceof Array) {
          data = google.visualization.arrayToDataTable(data);
        }

        var chart, options;
        var each = cs.each;
        var extend = cs.extend;

        // Set chart options
        options = {
          'title': $chart.title || '',
          'width': parseInt($chart.width),
          'height': parseInt($chart.height)
        };

        if ($chart.customOptions){
          extend(options, $chart.customOptions);
        }

        each(['backgroundColor', 'pieSliceBorderColor', 'colors'], function(prop){
          if (prop in $chart){
            options[prop] = $chart[prop];
          }
        });

        if ('pieSliceTextColor' in $chart){
          options.pieSliceTextStyle = {
            color: $chart.pieSliceTextColor
          };
        }

        if ('titleTextColor' in $chart){
          options.titleTextStyle = {
            color: $chart.titleTextColor
          };
        }

        if ('legendColor' in $chart){
          options.legend = {
            textStyle: {
              color: $chart.legendColor
            }
          };
        }

        chart = new google.visualization.PieChart($chart.el);
        chart.draw(data, options);
      },

      barchart: function($chart, data){
        var chart, options;
        var each = cs.each;
        var extend = cs.extend;

        // Set chart options
        options = {
          'title': $chart.title || '',
          'width': parseInt($chart.width),
          'height': parseInt($chart.height)
        };

        each(['backgroundColor', 'pieSliceBorderColor', 'colors'], function(prop){
          if (prop in $chart){
            options[prop] = $chart[prop];
          }
        });

        if ('titleTextColor' in $chart){
          options.titleTextStyle = {
            color: $chart.titleTextColor
          };
        }

        if ('legendColor' in $chart){
          options.legend = {
            textStyle: {
              color: $chart.legendColor
            }
          };
        }

        chart = new google.visualization.BarChart($chart.el);
        chart.draw(data, options);
      },

      linechart: function($chart, data){
        var chart, options;
        var each = cs.each;
        var extend = cs.extend;

        // Set chart options
        options = {
          'title': $chart.title || '',
          'width': parseInt($chart.width),
          'height': parseInt($chart.height)
        };

        each(['backgroundColor', 'pieSliceBorderColor', 'colors'], function(prop){
          if (prop in $chart){
            options[prop] = $chart[prop];
          }
        });

        if ('titleTextColor' in $chart){
          options.titleTextStyle = {
            color: $chart.titleTextColor
          };
        }

        if ('legendColor' in $chart){
          options.legend = {
            textStyle: {
              color: $chart.legendColor
            }
          };
        }

        chart = new google.visualization.LineChart($chart.el);
        chart.draw(data, options);
      }
    }
  });

})(chartstack);
