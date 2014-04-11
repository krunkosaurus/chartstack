/* global google, chartstack */
(function(cs){
  var each = cs.each;
  var extend = cs.extend;

  // -----------------------------
  // Library Namespace
  // -----------------------------

  cs.GoogleCharts = cs.GoogleCharts || {};


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
    update: function(data){
      var data = google.visualization.arrayToDataTable(data);
      var options = {
        'title': this.title || '',
        'width': parseInt(this.width),
        'height': parseInt(this.height)
      };
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
    update: function(data){
      var data = google.visualization.arrayToDataTable(data);
      var options = {
        'title': this.title || '',
        'width': parseInt(this.width),
        'height': parseInt(this.height)
      };
      this._chart.draw(data, options);
    }
  });


  // -----------------------------
  // Type: Column chart
  // -----------------------------

  cs.GoogleCharts.ColumnChart = cs.Visualization.extend({
    initialize: function(){
      console.log('bar!', this);
      this.render();
    },
    render: function(){
      this._chart = this._chart || new google.visualization.ColumnChart(this.el);
      //this.chart.draw(data, options);
    },
    update: function(data){
      var data = google.visualization.arrayToDataTable(data);
      var options = {
        'title': this.title || '',
        'width': parseInt(this.width),
        'height': parseInt(this.height)
      };
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
    update: function(data){
      var data = google.visualization.arrayToDataTable(data);
      var options = {
        'title': this.title || '',
        'width': parseInt(this.width),
        'height': parseInt(this.height)
      };
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
      //this.chart.draw(data, options);
    },
    update: function(data){
      var data = google.visualization.arrayToDataTable(data);
      var options = {
        'title': this.title || '',
        'width': parseInt(this.width),
        'height': parseInt(this.height)
      };
      this._chart.draw(data, options);
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
    "piechart": cs.GoogleCharts.PieChart
  });

})(chartstack);
