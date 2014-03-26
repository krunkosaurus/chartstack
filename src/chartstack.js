(function(chartstack) {
  var adapters, renderers, charts, Chart;

  // These three functions taken from https://github.com/spocke/punymce
  function is(o, t) {
    o = typeof(o);

    if (!t){
      return o != 'undefined';
    }

    return o == t;
  }

  function each(o, cb, s) {
    var n;

    if (!o){
      return 0;
    }

    s = !s ? o : s;

    if (is(o.length)) {
      // Indexed arrays, needed for Safari
      for (n=0; n<o.length; n++) {
        if (cb.call(s, o[n], n, o) === false){
          return 0;
        }
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
  }

  function extend(o, e) {
    each(e, function(v, n) {
      o[n] = v;
    });

    return o;
  }

  function bootstrap (){
    // If graph library isn't set in defaults, match provider to the first graph
    // lib found on the page that we have an adapter for.
    if (chartstack.defaults.provider){
      chartstack.library = chartstack.defaults.library;
    }else{
      each(Object.keys(chartstack.renderers), function(ns){
        if (ns in window){
          chartstack.library = ns;
          return false;
        }
      });

      if (!chartstack.library){
        throw Error('No charting library located.');
      }
      // Parse the dom.
      chartstack.parse()
    }
  }

  function parse(){
    var chartNodes = document.querySelectorAll('piechart,barchart,linechart');
    each(chartNodes, function(el){
      // Ensure data attribute exists.
      if (el.getAttribute('datasource')){
        charts.push(new Chart(el));
      }
    });
  }

  function getJSON(url, cb) {
    var xhr;
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
    };

    xhr = createXHR();
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4){
        cb(JSON.parse(xhr.responseText));
      }
    };
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
  }

  // Returns a chartstack object by html element id or element comparison.
  function get(strOrEl){
    var el = strOrEl.nodeName ? strOrEl : document.querySelector(strOrEl);
    var matchedChart;

    if (el){
      each(chartstack.charts, function(chart){
        if (el == chart.el){
          matchedChart = chart;
          return false;
        }
      });
      return matchedChart;
    }
    throw("That element doesn't exist on the page.");
  }

  // Adapters that normalize 3rd party api to a standard format.
  function addAdapter(domain, configObj){
    each(configObj, function(func, type){
      if (!adapters[domain]){
        adapters[domain] = {};
      }

      adapters[domain][type] = func;

    });
  }

  // Chart specific Renderers that Chartstack uses to render charts.
  function addRenderer(provider, configObj){
    each(configObj, function(func, type){
      if (!renderers[provider]){
        renderers[provider] = {};
      }

      renderers[provider][type] = func;
    });
  }

  // Placeholder for chartstack data adapters.
  chartstack.adapters = adapters = {};

  // Placeholder for chartstack renderers.
  chartstack.renderers = renderers = {};

  // Array of instantiated charts.
  chartstack.charts = charts = [];

  // Store them in API as well for plugin use.
  extend(chartstack, {
    parse : parse,
    is : is,
    each : each,
    extend : extend,
    getJSON : getJSON,
    get: get,
    addAdapter : addAdapter,
    addRenderer : addRenderer
  });

  // Defaults accessible from outside in case user wants to change them.
  // DOM properties override defaults.
  chartstack.defaults = {
    labels: true
  };

  // Main Chart class.
  chartstack.Chart = Chart = function(el) {
    var $chart = this, renderer;

    function setup() {
      var domain;

      $chart.el = el;
      // Type of chart.
      $chart.chartType = el.nodeName.toLocaleLowerCase();

      // Copy global defaults on to this chart.
      each(chartstack.defaults, function(k, v){
        $chart[v] = k;
      });

      // Find properties on dom element to override defaults.
      // Support arrays here so we can store the data under a different name.
      // TODO: This stuff should not stored in main namespace of $chart.
      each([['provider', 'domain'], 'datasource', 'library', 'labels', 'width', 'height', 'title'], function(attr){
        var test, newKey;

        if (is(attr, 'object')){
          newKey = attr[1];
          attr = attr[0];
        }
        test = el.getAttribute(attr);
        // If property exists in the DOM, save it.
        if (test){
          // Support for real booleans.
          if (test == 'false' || test == '0' || test == 'off'){
            test = false;
          }else if (test == 'true' || test == '1' || test == "on"){
            test = true;
          }

          if (newKey){
            $chart[newKey] = test;
          }else{
            $chart[attr] = test;
          }
        }
      });

      // Our made up HTML nodes are display: inline so we need to make
      // them block;
      el.style.display = "inline-block";

      if (renderers[chartstack.library] && renderers[chartstack.library].init){
        renderers[chartstack.library].init($chart);
      }

      // Check datasource starts with { or [ assume it's JSON or else
      // assume it's a URL to fetch.  We do not check for http anymore
      // as it can be a local/relative file.
      if ($chart.datasource.match(/^({|\[)/)){
        $chart.datasource = JSON.parse($chart.datasource);
      }else{
        domain = $chart.datasource.match(/\/\/(.*?)\//);
        if (domain){
          $chart.domain = domain[1];
        }
      }
    }

    // Fetches and normalizes data with a callback to pass data to.
    function fetch(cb){
      function finish(data){
        // Check if we have adapters for this domain and that we also
        // have a chart adapter for this chart from this domain.
        if (adapters[$chart.domain] && adapters[$chart.domain][$chart.chartType]){
          data = adapters[$chart.domain][$chart.chartType](data);
        }

        // Transform data into graph libs format.
        data = adapters[chartstack.library][$chart.chartType](data);
        cb(data);
      }

      // If this is a URL fetch data.
      if (typeof $chart.datasource == "string"){
        chartstack.getJSON($chart.datasource, finish);
        // The data is local.
      }else{
        finish($chart.datasource);
      }
    }

    setup();
    fetch(function(data){
      var renderer = chartstack.renderers[chartstack.library];
      if (!renderer){
        throw('Renderer for ' + chartstack.library + ' is missing.');
      }else if(!renderer[$chart.chartType]){
        throw('Renderer for ' + chartstack.library + ':' + $chart.chartType + ' is missing.');
      }
      renderer[$chart.chartType]($chart, data);
    });

    // Public methods
    extend(this, {
      show : function() {
        this.el.style.display = 'none';
      },

      hide : function() {
        this.el.style.display = 'block';
      },

      render : function(){
        // TODO
        // chartstack.renderer[this.chartType](this, this.fetch());
      },

      fetch : function(cb){
        cb || (cb = function(){});
        fetch(cb);
      }
    });
  };

  // Hack to support google charts.
  if (window.google){
    google.load('visualization', '1.0', {'packages':['corechart']});
    google.setOnLoadCallback(bootstrap);
  }else{
    document.addEventListener("DOMContentLoaded", bootstrap);
  }

  // Expose chartstack
  window.chartstack = chartstack;
})({});
