/* global google */
(function(root) {
  var previousChartstack = root.chartstack;
  var chartstack = root.chartstack = {};
  var adapters, renderers, charts, Chart, Adapter, Event, transformers, isDomReady, readyCallbacks = [];

  // These three functions taken from https://github.com/spocke/punymce
  function is(o, t){
    o = typeof(o);

    if (!t){
      return o != 'undefined';
    }

    return o == t;
  }

  function each(o, cb, s){
    var n;

    if (!o){
      return 0;
    }

    s = !s ? o : s;

    if (is(o.length)){
      // Indexed arrays, needed for Safari
      for (n=0; n<o.length; n++) {
        if (cb.call(s, o[n], n, o) === false){
          return 0;
        }
      }
    } else {
      // Hashtables
      for (n in o){
        if (o.hasOwnProperty(n)) {
          if (cb.call(s, o[n], n, o) === false){
            return 0;
          }
        }
      }
    }

    return 1;
  }

  // Extend object e on to o.
  function extend(o, e){
    each(e, function(v, n){
      o[n] = v;
    });

    return o;
  }


  function noConflict(){
    root.chartstack = previousChartstack;
    return this;
  }

  // DOM-ready queue method.
  function ready(cb){
    if (!isDomReady){
      readyCallbacks.push(cb);
    }else{
      cb();
    }
  }

  // Called when DOM and chart libs are loaded and ready.
  function bootstrap (){
    // If graph library isn't set in defaults, match provider to the first graph
    // lib found on the page that we have an adapter for.
    if (chartstack.defaults.library){
      chartstack.library = chartstack.defaults.library;
    }else{
      each(Object.keys(chartstack.renderers), function(ns){
        if (ns in window){
          chartstack.library = ns;
          return false;
        }
      });

      if (!chartstack.library){
        throw new Error('No charting library located.');
      }

      // Parse the dom.
      chartstack.parse();

      isDomReady = true;
      each(readyCallbacks, function(cb){
        cb();
      });
    }
  }

  // Parse the DOM and search for valid charting elements to turn to classes.
  function parse(){
    var chartNodes = document.querySelectorAll('piechart,barchart,linechart');
    each(chartNodes, function(el){
      // Ensure data attribute exists.
      if (el.getAttribute('datasource')){
        new Chart(el);
      }
    });
  }

  function getAjax(url, cb){
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
        cb(xhr.responseText);
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
    if (chartstack.is(configObj, 'function')){
      adapters[domain] = configObj;
    }else{
      each(configObj, function(func, type){
        // If domain doesn't exist, create the namespace.
        if (!adapters[domain]){
          adapters[domain] = {};
        }
        adapters[domain][type] = func;

      });
    }
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

  // Rendersets are chart library-related renderer and adapters.
  function addRenderSet(configObj){
    var libfullName = configObj.name;
    var libNamespace = configObj.namespace;

    chartstack.addRenderer(libNamespace, configObj.render)
    chartstack.addAdapter(libNamespace, configObj.adapter)
  }


  // Methods that transform non-JSON data to JSON.
  function addTransformer(name, func){
    transformers[name] = func;
  }

  // Placeholder for chartstack data adapters.
  chartstack.adapters = adapters = {};

  // Placeholder for chartstack renderers.
  chartstack.renderers = renderers = {};

  // Array of instantiated charts.
  chartstack.charts = charts = [];

  // Placeholder for transform data adapters.
  chartstack.transformers = transformers = {
    json : function(data){
      if (typeof data == 'string'){
        return JSON.parse(data);
      }else{
        return data;
      }
    }
  };

  // Store them in API as well for plugin use.
  extend(chartstack, {
    noConflict : noConflict,
    parse : parse,
    is : is,
    each : each,
    extend : extend,
    getAjax : getAjax,
    ready: ready,
    get: get,
    addAdapter : addAdapter,
    addRenderer : addRenderer,
    addRenderSet : addRenderSet,
    addtransformer : addTransformer
  });

  // Defaults accessible from outside in case user wants to change them.
  // DOM properties override defaults.
  chartstack.defaults = {
    labels: true
  };

  chartstack.DataAdapter = Adapter = function(){
  };

  // Chartstack generic Event class.
  /*
  chartstack.Event = Event = function(){
    this.allEvents = {};
  };

  extend(Event.prototype, {
    on: function(eventName, cb){
      if (!(eventName in this.allEvents)){
        this.allEvents[eventName] = [];
      }
      this.allEvents[eventName].push(cb);
    },

    off: function(eventName, cb){
      if (!eventName && !cb){
        this.allEvents = {};
      }
      if (cb){
        var match = this.allEvents[eventName].indexOf(cb);
        if (match){
          this.allEvents[eventName].splice(match, 1);
        }

      }else{
        delete this.allEvents[eventName];
      }
    },

    trigger: function(eventName){
      var self = this;
      var args = Array.prototype.slice.call(arguments, 0);
      args.shift();

      if (eventName in this.allEvents){
        this.allEvents[eventName].forEach(function(cb){
          cb.apply(self, args);
        });
      }
    }
  });*/

  var Events = chartstack.Events = {

    on: function(name, callback) {
      this.listeners || (this.listeners = {});
      var events = this.listeners[name] || (this.listeners[name] = []);
      events.push({callback: callback});
      return this;
    },
    off: function(name, callback) {
      if (!name && !callback) {
        this.listeners = void 0;
        delete this.listeners;
        return this;
      }
      var events = this.listeners[name] || [];
      for (var i = events.length; i--;) {
        if (callback && callback == events[i]['callback']) this.listeners[name].splice(i, 1);
        if (!callback || events.length == 0) {
          this.listeners[name] = void 0;
          delete this.listeners[name];
        }
      }
      return this;
    },
    trigger: function(name) {
      if (!this.listeners) return this;
      var args = Array.prototype.slice.call(arguments, 1);
      var events = this.listeners[name] || [];
      for (var i = 0; i < events.length; i++) {
        events[i]['callback'].apply(this, args);
      }
      return this;
    }

  };
  extend(chartstack, Events);



  // DataResource class
  // -----------------------------
  chartstack.DataResource = function(config){
    // Types: String (Data or URL), Object
    if (typeof config === "string") {
      if (config.match(/^({|\[)/)) {
        // Raw Data
        this.response = JSON.parse(config);
      } else {
        // URL + Params
        this.url = config;
      }
    } else {
      for (var option in config) {
        this[option] = config[option];
      }
    }
    this.configure();
  };

  chartstack.DataResource.prototype = {
    configure: function(){
      if (this.url !== void 0 && this.url.indexOf("?") !== -1 && this.params == void 0) {
        this.params = parseParams(this.url);
        this.url = this.url.split("?")[0];
      }
      //console.log('New Resource', this);
      return this;
    },
    get: function(attribute){
      return this.params[attribute] || null;
    },
    set: function(attributes){
      for (var attribute in attributes) {
        this.params[attribute] = attributes[attribute];
      }
      return this;
    }
  };
  extend(chartstack.DataResource.prototype, Events);


  // Dataset class
  // -----------------------------
  chartstack.Dataset = function(config){
    var resources = [], config = config || {};
    if (config instanceof Array) {
      each(config, function(source){
        resources.push(new chartstack.DataResource(source));
      });
    } else {
      resources.push(new chartstack.DataResource(config));
    }
    this.resources = resources;
    return;
  };

  chartstack.Dataset.prototype = {

    fetch: function(){
      var self = this, completions = 0;

      self.data = [];
      self.responses = [];

      var finish = function(response, index){
        var resource = self.resources[index],
            adapter  = self.resources[index]['adapter'];

        self.responses[index] = JSON.parse(response);
        self.data[index] = adapters[adapter].call(resource, self.responses[index]);

        completions++;
        if (completions == self.resources.length){
          //console.log('complete', self.data[0]);
          self.trigger("complete", self.data[0]);
        }
      };

      var error = function(){
        console.log('error');
      };

      each(self.resources, function(resource, index){
        var url = resource.url + buildQueryString(resource.params);
        var successSequencer = function(response){
          finish(response, index)
        };
        chartstack.getAjax(url, successSequencer, error);
        //getJSONP(url, successSequencer);
      });

      return self;
    },

    at: function(index){
      //if (typeof index == "string") {
      //  return this.resources where
      //}
      return this.resources[index] || null;
    }

  };
  extend(chartstack.Dataset.prototype, Events);



  function buildQueryString(params){
    var query = [];
    for (var key in params) {
      if (params[key]) {
        var value = params[key];
        if (Object.prototype.toString.call(value) !== '[object String]') {
          value = JSON.stringify(value);
        }
        value = encodeURIComponent(value);
        query.push(key + '=' + value);
      }
    }
    return "?" + query.join('&');
  }

  function parseParams(str){
    // via http://stackoverflow.com/a/2880929/2511985
    var urlParams = {},
        match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = str.split("?")[1];

    while (match = search.exec(query))
      urlParams[decode(match[1])] = decode(match[2]);

    return urlParams;
  }

  function getJSONP(url, success, error){
    // JSONP
    var callbackName = "ChartstackJSONPCallback" + new Date().getTime();
    while (callbackName in window) {
      callbackName += "a";
    }
    var loaded = false;
    window[callbackName] = function (response) {
      loaded = true;
      if (success && response) {
        success(response);
      };
      // Remove this from the namespace
      window[callbackName] = undefined;
    };
    url = url + "&jsonp=" + callbackName;
    var script = document.createElement("script");
    script.id = "chartstack-jsonp";
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
    // for early IE w/ no onerror event
    script.onreadystatechange = function() {
      if (loaded === false && this.readyState === "loaded") {
        loaded = true;
        if (error) error();
      }
    };
    // non-ie, etc
    script.onerror = function() {
      if (loaded === false) { // on IE9 both onerror and onreadystatechange are called
        loaded = true;
        if (error) error();
      }
    }
  }





  // Main Chart class.
  chartstack.Chart = Chart = function(args) {
    var $chart = this;
    // Add to internal array.
    chartstack.charts.push(this);

    // Collects properties off DOM element and inspects data source.

    function setup(){
      var setupDom, setupJS, domain;

      setupDom = function(){
        $chart.el = args;

        // Type of chart.
        $chart.chartType = $chart.el.nodeName.toLocaleLowerCase();

        // Our made up HTML nodes are display: inline so we need to make
        // them block;
        $chart.el.style.display = "inline-block";
      };

      setupJS = function(){
        $chart.el = args.el;

        // Type of chart.
        $chart.chartType = args.chartType;
      };

      // Copy global defaults on to this chart.
      each(chartstack.defaults, function(k, v){
        $chart[v] = k;
      });

      if ('nodeType' in args){
        setupDom();
      }else{
        setupJS();
      }

      // Find properties on dom element to override defaults.
      // Support arrays here so we can store the data under a different name.
      // TODO: These strings should be objects with support for defaults and other options.
      each([
        ['provider', 'domain'],
        'adapter',
        'datasource',
        'dataformat',
        'library',
        'labels',
        'width',
        'height',
        'title',
        'titleTextColor', // Custom, currently supported on Google  TODO: NVD3
        'legendColor', // Custom, currently supported on Google TODO: NVD3
        'colors', // item colors - Supported for all chart types for Google and NVD3.
        'pieSliceBorderColor', // TODO: Pie only  TODO: NVD3
        'pieSliceTextColor', // TODO: Pie only  TODO: NVD3
        'backgroundColor', // Bg color of chart.  TODO: NVD3
        'customOptions',
        // methods
        'formatRowLabel' // Pie labels, xlabels on other charts.
      ], function(attr){
        var test, newKey;

        if (is(attr, 'object')){
          newKey = attr[1];
          attr = attr[0];
        }
        test = args.nodeType ? args.getAttribute(attr) : args[attr];
        // If property exists, save it.
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

      // If we don't have a localized library set on this chart then set the
      // global one.
      if (!$chart.library){
        $chart.library = chartstack.library;
      }

      // Used to transform response if needed to JSON.
      if (!$chart.dataformat){
        $chart.dataformat = 'json';
      }

      // Run library renderer's init if the lib needs to do some setup.
      if (renderers[$chart.library] && renderers[$chart.library].init){
        renderers[$chart.library].init($chart);
      }


      // Check datasource starts with { or [ assume it's JSON or else
      // assume it's a URL to fetch.  We do not check for http anymore
      // as it can be a local/relative file.
      if (typeof $chart.datasource == 'string'){

        $chart.dataset = new chartstack.Dataset($chart.datasource);
        if ($chart.adapter) {
          $chart.dataset.resources[0].adapter = $chart.adapter;
        }
        $chart.dataset.on("complete", function(data){
          var renderer = chartstack.renderers[$chart.library];
          //var data = adapters[$chart.domain][$chart.chartType].call(new Adapter, data);
          renderer[$chart.chartType]($chart, data);
        })

        if ($chart.datasource.match(/^({|\[)/)){
          $chart.datasource = JSON.parse($chart.datasource);
        }else{
          domain = $chart.datasource.match(/\/\/(.*?)\//);
          if (domain){
            $chart.domain = domain[1];
          }
        }
      }
    }

    // Fetches and normalizes data with a callback to pass data to.
    function fetch(cb){
      function finish(data){

        // Transform data from CSV, etc, to JSON.
        if ($chart.dataformat in transformers){
          data = transformers[$chart.dataformat](data);
        }else{
          throw new Error('Transformer for datatype missing: ' + $chart.dataformat);
        }

        // If domain specified, check if we have adapters for this domain and
        // that we also have a chart adapter for this chart from this domain.
        if (adapters[$chart.domain] && adapters[$chart.domain][$chart.chartType]){
          data = adapters[$chart.domain][$chart.chartType].call(new Adapter, data);
        }

        // TODO: Put this in a modular place. Probably in adapter object post init.
        if ($chart.formatRowLabel){
          chartstack.each(data.data, function(key, i){
            if (i == 0){ return;}
            data.data[i][0] = $chart.formatRowLabel(key[0]);
          });
        }

        // Transform data into graph libs format using graph library's data
        // adapter. Data adapter can be one method or an object of methods of
        // chart types depending on how the chart library handles data.
        if (chartstack.is(adapters[$chart.library], 'function')){
          data = adapters[$chart.library].call(new Adapter, data);
        }else{
          data = adapters[$chart.library][$chart.chartType].call(new Adapter, data);
        }
        cb(data);
      }

      // If this is a URL fetch data.
      if (typeof $chart.datasource == "string"){
        chartstack.getAjax($chart.datasource, finish);

        // The data is local.
      }else{
        finish($chart.datasource);
      }
    }

    setup();
    fetch(function(data){
      var renderer = chartstack.renderers[$chart.library];
      if (!renderer){
        throw('Renderer for ' + $chart.library + ' is missing.');
      }else if(!renderer[$chart.chartType]){
        throw('Renderer for ' + $chart.library + ':' + $chart.chartType + ' is missing.');
      }

      // Render chart using data.
      renderer[$chart.chartType]($chart, data);
    });

    // Public methods
    extend($chart, {
      show : function(){
        $chart.trigger('show');
        return this;
      },

      hide : function(){
        $chart.trigger('hide');
        return this;
      },

      draw: function(){
        $chart.trigger('draw');
        return this;
      },

      fetch : function(cb){
        this.dataset.fetch();
        cb || (cb = function(){});
        fetch(cb);
        return this;
      }
    });
  };

  // Add Event support to Chart class.
  //Chart.prototype = new chartstack.Event();
  Chart.prototype = {};
  extend(Chart.prototype, Events);

  // Hack to support google charts.
  if (window.google){
    google.load('visualization', '1.0', {'packages':['corechart']});
    google.setOnLoadCallback(bootstrap);
  }else{
    document.addEventListener("DOMContentLoaded", bootstrap);
  }
})(this);
