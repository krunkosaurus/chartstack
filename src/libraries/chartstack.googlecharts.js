/* global google, chartstack */
(function(cs){
  var each = cs.each;
  var extend = cs.extend;

  // -----------------------------
  // Library Namespace
  // -----------------------------

  cs.GoogleCharts = cs.GoogleCharts || {};

  // "https://www.google.com/jsapi"


  // -----------------------------
  // Type: Area chart
  // -----------------------------

  cs.GoogleCharts.AreaChart = cs.Visualization.extend({
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
        title: this.chartOptions.title || '',
        height: parseInt(this.chartOptions.height),
        width: parseInt(this.chartOptions.width)
      });
      this._chart.draw(data, options);
    }
  });


  // -----------------------------
  // Type: Bar chart
  // -----------------------------

  cs.GoogleCharts.BarChart = cs.Visualization.extend({
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
        title: this.chartOptions.title || '',
        height: parseInt(this.chartOptions.height),
        width: parseInt(this.chartOptions.width)
      });
      this._chart.draw(data, options);
    }
  });


  // -----------------------------
  // Type: Column chart
  // -----------------------------

  cs.GoogleCharts.ColumnChart = cs.Visualization.extend({
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
        title: this.chartOptions.title || '',
        height: parseInt(this.chartOptions.height),
        width: parseInt(this.chartOptions.width)
      });
      this._chart.draw(data, options);
    }
  });


  // -----------------------------
  // Type: Line chart
  // -----------------------------

  cs.GoogleCharts.LineChart = cs.Visualization.extend({
    initialize: function(){
      this.render();
    },
    render: function(){
      this._chart = this._chart || new google.visualization.LineChart(this.el);
    },
    update: function(){
      var data = google.visualization.arrayToDataTable(this.data[0]);
      var options = extend(this.chartOptions, {
        title: this.chartOptions.title || '',
        height: parseInt(this.chartOptions.height),
        width: parseInt(this.chartOptions.width)
      });
      this._chart.draw(data, options);
    }
  });


  // -----------------------------
  // Type: Pie chart
  // -----------------------------

  cs.GoogleCharts.PieChart = cs.Visualization.extend({
    initialize: function(){
      this.render();
    },
    render: function(){
      this._chart = this._chart || new google.visualization.PieChart(this.el);
    },
    update: function(){
      var data = google.visualization.arrayToDataTable(this.data[0]);
      var options = extend(this.chartOptions, {
        title: this.chartOptions.title || '',
        height: parseInt(this.chartOptions.height),
        width: parseInt(this.chartOptions.width)
      });
      this._chart.draw(data, options);
    }
  });


  // -----------------------------
  // Type: Table
  // -----------------------------

  cs.GoogleCharts.DataTable = cs.Visualization.extend({
    initialize: function(){
      this.render();
    },
    render: function(){
      this._chart = this._chart || new google.visualization.Table(this.el);
      //this.chart.draw(data, options);
    },
    update: function(){
      var data = google.visualization.arrayToDataTable(this.data[0]);
      this._chart.draw(data, this.chartOptions);
    }
  });


  // -----------------------------
  // Register Methods
  // -----------------------------

  cs.Visualization.register("google", {
    "areachart": cs.GoogleCharts.AreaChart,
    "barchart": cs.GoogleCharts.BarChart,
    "columnchart": cs.GoogleCharts.ColumnChart,
    "linechart": cs.GoogleCharts.LineChart,
    "piechart": cs.GoogleCharts.PieChart,
    "datatable": cs.GoogleCharts.DataTable
  });

})(chartstack);
