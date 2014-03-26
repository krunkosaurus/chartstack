/* global chartstack, nv, d3 */
chartstack.addRenderer('nv', {

  init: function($chart){
    // Create the SVG element that D3 needs.
    $chart.svg = document.createElementNS ('http://www.w3.org/2000/svg', 'svg');
    // Set height and width of SVG to it's parent's container.
    chartstack.each(['width', 'height'], function(m){
      var v = parseInt($chart.el.getAttribute(m));
      $chart[m] = v;
      $chart.svg.setAttributeNS(null, m, v);
    });

    $chart.el.appendChild($chart.svg);
  },

  piechart: function($chart, data){
    // Regular pie chart example
    nv.addGraph(function() {
      var chart = nv.models.pieChart()
        .x(function(d) { return d.label; })
        .y(function(d) { return d.value; })
        .showLabels($chart.labels);

      d3.select($chart.svg)
        .datum(data)
        .transition().duration(350)
        .call(chart);

      return chart;
    });
  },

  barchart: function($chart, data){
    nv.addGraph(function() {
      var chart = nv.models.multiBarChart();

      // Required to set the height once more or it's too small.
      chart.width($chart.width).height($chart.height);

      if (data.result[0].values[0].x instanceof Date){
        chart.xAxis
          .tickFormat(function(d) {
            return d3.time.format('%b %d')(new Date(d));
          });
      }else{
        chart.xAxis
        .tickFormat(d3.format('f'));
      }

      chart.yAxis
        //.axisLabel('Count')
        .tickFormat(d3.format(',f'));

      d3.select($chart.svg)
        .datum(data.result)
        .transition().duration(500)
        .call(chart);

      nv.utils.windowResize(chart.update);
    });
  },

  linechart: function($chart, data){
    var chart = nv.models.lineChart()
      .x(function(d) { return d[0]; })
      .y(function(d) { return d[1]; })
      .color(d3.scale.category10().range())
      .useInteractiveGuideline(true);

    chart.width($chart.width).height($chart.height);
    if (data.result[0].values[0][0] instanceof Date){
      chart.xAxis
        .tickFormat(function(d) {
          return d3.time.format('%b %d')(new Date(d));
        });
    }else{
      chart.xAxis
        .tickFormat(d3.format('f'));
    }

    //chart.xAxis
    //  .tickFormat(function(d) {
    //    return d3.time.format('%x')(new Date(d));
    //  });

    chart.yAxis
      .tickFormat(d3.format(',g'));

    d3.select($chart.svg)
      .datum(data.result)
      .call(chart);

    nv.utils.windowResize(chart.update);
    return chart;
  }

});
