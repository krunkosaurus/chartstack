// Data normalizing adaper for keen.io API.
chartstack.addAdapter('api.keen.io', {
    piechart: function(o){
        var ar = [];

        chartstack.each(o.result, function(a){
            var keys = Object.keys(a);
            var entry = {
                label: a[keys[0]],
                value: a[keys[1]]
            };
            ar.push(entry)
        });
        return ar;
    },

    barchart: function(o){
        var each = chartstack.each;
        var ar = [];
        var sections = {};

        chartstack.each(o.result, function(a){
            // Iterate through value array.
            var lastTime = new Date(a.timeframe.start);
            //lastTime = d3.time.format('%b %d')(new Date(a.timeframe.start));
//console.log('lastTime', lastTime);
            each(a.value, function(v){
                var keys = Object.keys(v);
                var entry = {};

                if (!sections[v[keys[0]]]){
                    sections[v[keys[0]]] = {};
                    sections[v[keys[0]]].key = v[keys[0]];
                    sections[v[keys[0]]].values = [];
                }
                sections[v[keys[0]]].values.push({
                    x: lastTime,
                    y: v[keys[1]]
                });
            });
        });

        each(sections, function(s){
            ar.push(s);
        });
        console.log('ar', ar);
        return ar;
    }
})
