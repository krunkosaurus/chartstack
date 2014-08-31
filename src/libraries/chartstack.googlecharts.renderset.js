/* global google, chartstack */
(function(cs){
  cs.addRenderSet({
    name: 'Google Charts',
    namespace: 'google',

    // If loadLib exists it is called to load the graphic library.
    // Must execute passed callback when the library is loaded.
    // If loadLib does not exist, we assume the user loaded the library before
    // chartstack.js already (most cases).
    loadLib: function(cb){
      cs.googleLoadedCallback = function(){
        delete cs.googleLoadedCallback;
        if (cb){
          cb('google');
        }
      }
      document.write('\x3Cscript type="text/javascript" src="https://www.google.com/jsapi?autoload=' + encodeURIComponent('{"modules":[{"name":"visualization","version":"1","packages":["corechart","table"],callback: chartstack.googleLoadedCallback}]}') + '">\x3C/script>');
    },

    // Adapts data from UD format to library format.
    adapters: function(data){
      return google.visualization.arrayToDataTable(data.data);
    },

    // Renders DOM charts.
    charts: {
      pie: function($chart, data){

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

      bar: function($chart, data){
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

      line: function($chart, data){
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
