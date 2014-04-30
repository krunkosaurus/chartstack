/* global google, chartstack */
(function(cs){
  cs.registerLibrary({
    name: 'GoogleCharts',
    namespace: 'google',
    attributes: ['animation', 'backgroundColor', 'bar', 'chartArea', 'fontName', 'fontSize', 'isStacked', 'hAxis', 'legend', 'orientation', 'titleTextStyle', 'tooltip', 'vAxis'],
    // If loadLib exists it is called to load the graphic library.
    // Must execute passed callback when the library is loaded.
    // If loadLib does not exist, we assume the user loaded the library before
    // chartstack.js already (most cases).
    loadLib: function(cb){
      cs.googleLoaded = function(){
        cb();
        delete cs.googleLoaded;
      }
      document.write('\x3Cscript type="text/javascript" src="https://www.google.com/jsapi?autoload=' + encodeURIComponent('{"modules":[{"name":"visualization","version":"1","packages":["corechart","table"],callback: chartstack.googleLoaded}]}') + '">\x3C/script>');
    },
    charts: [{
      type : 'AreaChart',
      events: {
        initialize: function(){
          //this.trigger('error', 'testing pie errors');
          this.render();
        },
        render: function(){
          this._chart = this._chart || new google.visualization.AreaChart(this.el);
        },
        update: function(){
          var data = google.visualization.arrayToDataTable(this.data[0]);
          var options = cs.extend(this.chartOptions, {
            title: this.title || '',
            height: parseInt(this.height),
            width: parseInt(this.width)
          });
          this._chart.draw(data, options);
        }
      }
    }, {
      type : 'BarChart',
      events: {
        initialize: function(){
          //console.log('bar!', this);
          this.render();
        },
        render: function(){
          this._chart = this._chart || new google.visualization.BarChart(this.el);
        },
        update: function(){
          var data = google.visualization.arrayToDataTable(this.data[0]);
          var options = cs.extend(this.chartOptions, {
            title: this.title || '',
            height: parseInt(this.height),
            width: parseInt(this.width)
          });
          this._chart.draw(data, options);
        }
      }
    }, {
      type : 'ColumnChart',
      events: {
        initialize: function(){
          //console.log('bar!', this);
          this.render();
        },
        render: function(){
          this._chart = this._chart || new google.visualization.ColumnChart(this.el);
          //this.chart.draw(data, options);
        },
        update: function(){
          var data = google.visualization.arrayToDataTable(this.data[0]);
          var options = cs.extend(this.chartOptions, {
            title: this.title || '',
            height: parseInt(this.height),
            width: parseInt(this.width)
          });
          this._chart.draw(data, options);
        }
      }
    }, {
      type : 'LineChart',
      events: {
        initialize: function(){
          this.render();
        },
        render: function(){
          this._chart = this._chart || new google.visualization.LineChart(this.el);
        },
        update: function(){
          var data = google.visualization.arrayToDataTable(this.data[0]);
          var options = cs.extend(this.chartOptions, {
            title: this.title || '',
            height: parseInt(this.height),
            width: parseInt(this.width)
          });
          this._chart.draw(data, options);
        }
      }
    }, {
      type : 'PieChart',
      events: {
        initialize: function(){
          this.render();
        },
        render: function(){
          this._chart = this._chart || new google.visualization.PieChart(this.el);
        },
        update: function(){
          var data = google.visualization.arrayToDataTable(this.data[0]);
          var options = cs.extend(this.chartOptions, {
            title: this.title || '',
            height: parseInt(this.height),
            width: parseInt(this.width)
          });
          this._chart.draw(data, options);
        }
      }
    }, {
      type : 'DataTable',
      events: {
        initialize: function(){
          this.render();
        },
        render: function(){
          this._chart = this._chart || new google.visualization.Table(this.el);
          //this.chart.draw(data, options);
        },
        update: function(){
          var data = google.visualization.arrayToDataTable(this.data[0]);
          var options = cs.extend(this.chartOptions, {
            title: this.title || '',
            height: parseInt(this.height),
            width: parseInt(this.width)
          });
          this._chart.draw(data, options);
        }
      }
    }]
  });

})(chartstack);
