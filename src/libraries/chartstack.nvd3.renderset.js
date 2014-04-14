/* global chartstack */
(function(cs){
  cs.addRenderSet({
    name: 'NVD3',
    namespace: 'nv',

    // Adapts data from UD format to library format.
    adapter: {
      piechart: function(data){
        data = data.data;

        var ar = [];

        // Pop off unused header array.
        data.shift();

        cs.each(data, function(item){
          var entry = {
            label: item[0],
            value: item[1]
          };
          ar.push(entry);
        });
        return ar;
      },

      barchart: function(data){
        data = data.data;

        var each = cs.each;
        var section = [];
        var colomnKeys = data.shift();
        var rowDescription = colomnKeys.shift();

        // Prep rows
        each(colomnKeys, function(name){
          section.push({
            key: name,
            values: []
          });
        });

        each(data, function(selection){
          var rowDesc = selection.shift();
          each(selection, function(y, a){
            section[a].values.push({
              x: rowDesc,
              y: y
            });
          });
        });

        return {
          result: section,
          options: {
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

        // Prep rows
        each(colomnKeys, function(name){
          section.push({
            key: name,
            values: []
          });
        });

        each(data, function(selection){
          var rowDesc = selection.shift();
          each(selection, function(y, a){
            section[a].values.push([rowDesc, y]);
          });
        });

        return {
          result: section,
          options: {
            rowDescription: rowDescription
          }
        };
      }
    },

    // Renders DOM charts.
    render: {
      init: function($chart){
        // Create the SVG element that D3 needs.
        $chart.svg = document.createElementNS ('http://www.w3.org/2000/svg', 'svg');
        // Set height and width of SVG to it's parent's container.
        cs.each(['width', 'height'], function(m){
          var v = parseInt($chart[m]);
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

          if ('colors' in $chart){
            chart.color($chart.colors);
          }

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

          if ('colors' in $chart){
            chart.color($chart.colors);
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

        if (data.result[0].values[0][0] instanceof Date){
          chart.xAxis
            .tickFormat(function(d) {
              return d3.time.format('%b %d')(new Date(d));
            });
        }else{
          chart.xAxis
            .tickFormat(d3.format('f'));
        }

        if ('colors' in $chart){
          chart.color($chart.colors);
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

        chart.width($chart.width).height($chart.height).update();
        nv.utils.windowResize(chart.update);
        return chart;
      }

    }

  });
})(chartstack);
