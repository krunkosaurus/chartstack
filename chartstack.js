(function(chartstack) {
	// These three functions taken from https://github.com/spocke/punymce
	function is(o, t) {
		o = typeof(o);

		if (!t)
			return o != 'undefined';

		return o == t;
	};

	function each(o, cb, s) {
		var n;

		if (!o)
			return 0;

		s = !s ? o : s;

		if (is(o.length)) {
			// Indexed arrays, needed for Safari
			for (n=0; n<o.length; n++) {
				if (cb.call(s, o[n], n, o) === false)
					return 0;
			}
		} else {
			// Hashtables
			for (n in o) {
				if (o.hasOwnProperty(n)) {
					if (cb.call(s, o[n], n, o) === false)
						return 0;
				}
			}
		}

		return 1;
	};

	function extend(o, e) {
		each(e, function(v, n) {
			o[n] = v;
		});

		return o;
	};

    function getJSON(url, cb) {
        var createXHR, xhr;
        var createXHR = function(){
            var xhr;
            if (window.ActiveXObject){
                try{
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }catch(e){
                    console.log(e.message);
                    xhr = null;
                }
            }else{
                xhr = new XMLHttpRequest();
            }
            return xhr;
        }

        xhr = createXHR();
        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4){
                cb(JSON.parse(xhr.responseText));
            }
        }
        xhr.open('GET', url, true)
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send()
	}

    // Array of instantiated charts.
    chartstack.chartsAr = chartsAr = [];

	// Store them in API as well for plugin use
	extend(chartstack, {
		is : is,
		each : each,
		extend : extend,
        getJSON : getJSON
	});

	chartstack.Chart = Chart = function(el) {
        var nodeName, dataSource, svg;

		// TODO should extend Default settings here.
		function setup() {
            var width, height;

            // Our made up HTML nodes are display: inline so we need to make
            // them block;
            el.style.display = "inline-block";

            // Create the SVG element that D3 needs.
            svg = document.createElementNS ('http://www.w3.org/2000/svg', 'svg');

            // Set height and width of SVG.
            each(['width', 'height'], function(m){
                svg.setAttributeNS (null, m, parseInt(el.getAttribute(m)));
            });

            el.appendChild(svg);
		};

        function normalizeKeen(o){
            var ar = [];

            each(o.result, function(a){
                var keys = Object.keys(a);
                var entry = {
                    label: a[keys[0]],
                    value: a[keys[1]]
                };
                ar.push(entry)
            });
            console.log('ar', ar);
            return ar;
        }

        setup();

        this.nodeEl = el;
        // Type of chart.
        this.nodeName = nodeName = el.nodeName.toLocaleLowerCase();

        this.dataSource = dataSource = el.getAttribute('datasource');
        // If we have a datasource property.
        // TODO: Check if its a url or map to window JS object.
        if (dataSource){
            chartstack.getJSON(dataSource, function(o){
                o = normalizeKeen(o);

                if (nodeName == 'piechart'){
                    // Regular pie chart example
                    nv.addGraph(function() {
                        var chart = nv.models.pieChart()
                            .x(function(d) { return d.label })
                            .y(function(d) { return d.value })
                            .showLabels(true);

                        d3.select(svg)
                            .datum(o)
                            .transition().duration(350)
                            .call(chart);

                        return chart;
                    });
                }
            });
        }

		// Public methods
		extend(this, {
			show : function() {
			},

			hide : function() {
			}
		});
	};

    bootstrap = function(){
        // TODO: Here we decide which graph library we are using.
        var charts = document.querySelectorAll('piechart,barchart');
        each(charts, function(el, i, all){
            chartsAr.push(new Chart(el));
        });

    };

    document.addEventListener("DOMContentLoaded", bootstrap);

	// Expose chartstack
	window.chartstack = chartstack;
})({});
