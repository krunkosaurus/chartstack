/* global google, chartstack */
(function(cs){
  var each = cs.each;
  var extend = cs.extend;

  cs.addLibrary({
    namespace: 'GoogleCharts',
    windowNamespace: 'google',
    attributes: [
      "animation",
      "backgroundColor",
      "bar",
      "chartArea",
      "fontName",
      "fontSize",
      "isStacked",
      "hAxis",
      "legend",
      "orientation",
      "titleTextStyle",
      "tooltip",
      "vAxis"
    ],
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
          var options = extend(this.chartOptions, {
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
          var options = extend(this.chartOptions, {
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
          var options = extend(this.chartOptions, {
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
          var options = extend(this.chartOptions, {
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
          var options = extend(this.chartOptions, {
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
          var options = extend(this.chartOptions, {
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
