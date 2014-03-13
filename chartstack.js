(function(chartstack) {
    var adapters, charts;

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

    function bootstrap (){
        // TODO: Here we decide which graph library we are using.
        var chartNodes = document.querySelectorAll('piechart,barchart');
        each(chartNodes, function(el){
            charts.push(new Chart(el));
        });
    }

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

    function addAdapter(domain, configObj){
        each(configObj, function(func, type){
            if (!adapters[domain]){
                adapters[domain] = {};
            }

            adapters[domain][type] = func;

        });
    }

    // Placeholder for chartstack data adapters.
    chartstack.adapters = adapters = {};

    // Array of instantiated charts.
    chartstack.charts = charts = [];

	// Store them in API as well for plugin use.
	extend(chartstack, {
		is : is,
		each : each,
		extend : extend,
        getJSON : getJSON,
        addAdapter: addAdapter
	});

    // Main Chart class.
	chartstack.Chart = Chart = function(el) {
        var defaults;
        var self = this;

        defaults = {
            labels: true
        };

		// TODO should extend Default settings here.
		function setup() {
            var width, height;

            // Our made up HTML nodes are display: inline so we need to make
            // them block;
            el.style.display = "inline-block";

            // Create the SVG element that D3 needs.
            self.svg = document.createElementNS ('http://www.w3.org/2000/svg', 'svg');

            // Set height and width of SVG to it's parent's container.
            each(['width', 'height'], function(m){
                svg.setAttributeNS (null, m, parseInt(el.getAttribute(m)));
            });

            el.appendChild(svg);

            self.el = el;
            // Type of chart.
            self.chartType = el.nodeName.toLocaleLowerCase();

            self.dataSource = el.getAttribute('datasource');

            if (self.dataSource){
                self.domain = self.dataSource.match(/\/\/(.*?)\//)[1];
            }
		};

        // Fetches and normalizes data with a callback to pass data to.
        function fetch(cb){
            // TODO: Allow support for JS object references here.
            // Either as embedded JSON or object to window[variable].
            chartstack.getJSON(self.dataSource, function(o){
                // Check if data is from a domain request.
                if (self.domain){
                    // Check if we have adapters for this domain and that we also
                    // have a chart adapter for this chart from this domain.
console.log('self.chartType', self.chartType);
                    if (adapters[self.domain] && adapters[self.domain][self.chartType]){
                        var o = adapters[self.domain][self.chartType](o);
                        cb(o);
                        // Else just return un-normalized results.
                    }else{
                        console.log('nooooooo');
                        cb(o);
                    }
                // The data is local.
                }else{
                    // TODO: Parse inline JSON or fetch JS object from window here.
                }
            });
        }

        setup();
        fetch(function(o){
            if (self.chartType == 'piechart'){
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

		// Public methods
		extend(this, {
			show : function() {
			},

			hide : function() {
			},

			refresh : function() {
			},

            fetch : fetch
		});
	};

    document.addEventListener("DOMContentLoaded", bootstrap);

	// Expose chartstack
	window.chartstack = chartstack;
})({});
