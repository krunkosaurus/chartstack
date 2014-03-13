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
        });3
        return ar;
    }
})
