chartstack.addRenderer('nvd3', {
    piechart: function($chart, data){
        // Regular pie chart example
        nv.addGraph(function() {
            var chart = nv.models.pieChart()
                .x(function(d) { return d.label })
                .y(function(d) { return d.value })
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

            chart.xAxis
            //.tickFormat(d3.format(',f'));
                .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); });

            chart.yAxis
                .axisLabel('Count')
                .tickFormat(d3.format(',.1f'));

            d3.select($chart.svg)
                .datum(data)
                .transition().duration(500)
                .call(chart);

            nv.utils.windowResize(chart.update);
        });
    },

    linechart: function($chart, data){
        var chart = nv.models.cumulativeLineChart()
            .x(function(d) { return d[0] })
            .y(function(d) { return d[1] }) //adjusting, 100% is 1.00, not 100 as it is in the data
            .color(d3.scale.category10().range())
            .useInteractiveGuideline(true);

        chart.width($chart.width).height($chart.height);

        chart.xAxis
            .tickFormat(function(d) {
                return d3.time.format('%x')(new Date(d))
            });

        chart.yAxis
            .tickFormat(d3.format('1g'));

        d3.select($chart.svg)
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
    }

});