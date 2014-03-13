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

		if (!o){
			return 0;
        }

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
					if (cb.call(s, o[n], n, o) === false){
						return 0;
                    }
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
                    console.warn(e.message);
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

    // Defaults accessible from outside in case user wants to change them.
    // DOM properties override defaults.
    chartstack.defaults = {
        labels: true
    };

    // Main Chart class.
	chartstack.Chart = Chart = function(el) {
        var self = this;

		// TODO should extend Default settings here.
		function setup() {
            var domain;

            self.el = el;
            // Type of chart.
            self.chartType = el.nodeName.toLocaleLowerCase();

            // Copy global defaults on to this chart.
            each(chartstack.defaults, function(k, v){
                self[v] = k;
            });

            // Find properties on dom element to override defaults.
            each(['domain', 'labels'], function(attr){
                var test = el.getAttribute(attr);
                if (test){
                    // Support for real booleans.
                    if (test == 'false' || test == '0' || test == 'off'){
                        test = false;
                    }else if (test == 'true' || test == '1' || test == "on"){
                        test = true;
                    }
                    self[attr] = test;
                }
            });

            // Data source is required.
            self.dataSource = el.getAttribute('datasource');

            // Our made up HTML nodes are display: inline so we need to make
            // them block;
            el.style.display = "inline-block";

            // Setup SVG
            // =========
            // Create the SVG element that D3 needs.
            self.svg = document.createElementNS ('http://www.w3.org/2000/svg', 'svg');
            // Set height and width of SVG to it's parent's container.
            each(['width', 'height'], function(m){
                self.svg.setAttributeNS(null, m, parseInt(el.getAttribute(m)));
            });

            el.appendChild(self.svg);

            // Check dataSource starts with { assum it's JSON or else assume
            // it's a URL to fetch.  We do not check for http anymore as it
            // can be a local/relative file.
            if (self.dataSource.match('^{')){
                self.dataSource = JSON.parse(self.dataSource);
            }else{
                domain = self.dataSource.match(/\/\/(.*?)\//);
                if (domain){
                    self.domain = domain[1];
                }
            }
		};

        // Fetches and normalizes data with a callback to pass data to.
        function fetch(cb){
            function finish(data){
                // Check if we have adapters for this domain and that we also
                // have a chart adapter for this chart from this domain.
                if (adapters[self.domain] && adapters[self.domain][self.chartType]){
                    var data = adapters[self.domain][self.chartType](data);
                    cb(data);
                    // Else just return un-normalized results.
                }else{
                    cb(data);
                }
            }

            // If this is a URL fetch data.
            if (typeof self.dataSource == "string"){
                chartstack.getJSON(self.dataSource, finish);
            // The data is local.
            }else{
                finish(self.dataSource);
            }
        }

        setup();
        fetch(function(o){
            if (self.chartType == 'piechart'){
                // Regular pie chart example
                nv.addGraph(function() {
                    var chart = nv.models.pieChart()
                        .x(function(d) { return d.label })
                        .y(function(d) { return d.value })
                        .showLabels(self.labels);

                    d3.select(self.svg)
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
