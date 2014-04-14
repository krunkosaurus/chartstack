/* global google */
(function(root) {
  var previousChartstack = root.chartstack;
  var chartstack = root.chartstack = {};
  var adapters, charts, Chart, Events, transformers, isDomReady, readyCallbacks = [];

  // Placeholder for chartstack data adapters.
  chartstack.adapters = adapters = {};

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

  // Defaults accessible from outside in case user wants to change them.
  // DOM properties override defaults.
  chartstack.defaults = extend({
    labels: true
  }, chartstack.defaults || {});


  // -----------------------------
  // Events class
  // -----------------------------
  // Extended by all classes that
  // require event listeners
  // -----------------------------

  var Events = chartstack.Events = {

    on: function(name, callback) {
      this.listeners || (this.listeners = {});
      var events = this.listeners[name] || (this.listeners[name] = []);
      events.push({callback: callback});
      return this;
    },

    // once: function(name, callback) {},

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



  // -----------------------------
  // DataResource class
  // -----------------------------
  // This class is never directly
  // instantiated, but is managed
  // by the Dataset class
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
        this.params = chartstack.parseParams(this.url);
        this.url = this.url.split("?")[0];
      }
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


  // -----------------------------
  // Dataset class
  // -----------------------------
  // This class instantiates and
  // manages instances of the
  // DataResource class
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
        //chartstack.getJSONP(url, successSequencer);
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


  // -----------------------------
  // Visualization class
  // -----------------------------
  // This class is never directly
  // instantiated, but extended
  // by all library rendersets
  // -----------------------------

  chartstack.Visualization = function(config){
    var self = this;
    extend(self, config);

    self.options = self.options || {};
    self.width = self.width || self.el.offsetWidth;

    // Set default event handlers
    self.on("error", function(){
      visualErrorHandler.apply(this, arguments);
    });
    self.on("update", function(){
      self.update.apply(this, arguments);
    });

    // Let's kick it off!
    this.initialize();
  };

  chartstack.Visualization.prototype = {
    initialize: function(){
      // Sets listeners and prepares data
    },
    render: function(){
      // Builds artifacts
    },
    update: function(){
      // Optional: handles data updates
    },
    remove: function(){
      // Cleanup and DOM removal
    }
  };
  extend(chartstack.Visualization.prototype, Events);

  chartstack.Libraries = {};

  chartstack.Visualization.register = function(name, methods){
    chartstack.Libraries[name] = chartstack.Libraries[name] || {};
    for (var method in methods) {
      chartstack.Libraries[name][method] = methods[method];
    }
  };

  chartstack.Visualization.extend = function(protoProps, staticProps){
    var parent = this, Visualization;
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      Visualization = protoProps.constructor;
    } else {
      Visualization = function(){ return parent.apply(this, arguments); };
    }
    extend(Visualization, parent, staticProps);
    var Surrogate = function(){ this.constructor = Visualization; };
    Surrogate.prototype = parent.prototype;
    Visualization.prototype = new Surrogate;
    if (protoProps) extend(Visualization.prototype, protoProps);
    Visualization.__super__ = parent.prototype;
    return Visualization;
  };

  function visualErrorHandler(){
    console.log("Error!", arguments);
  }



  // -----------------------------
  // Chart class
  // -----------------------------
  // Primary class encompassing
  // every chartstack instance
  // -----------------------------

  chartstack.Chart = Chart = function(args) {
    var $chart = this,
    setupVis = {},
    setupData = {},
    options = args || {};

    // Add to internal array.
    chartstack.charts.push($chart);

    // Collects properties off DOM element and inspects data source.
    function setup(){
      var setupDom, setupJS;
      var initAttributes, dataAttributes, visualAttributes;

      setupDom = function(){
        //$chart.el = args;
        setupVis['el'] = options;

        // Type of chart.
        options['chartType'] = setupVis['el'].nodeName.toLocaleLowerCase();

        // Our made up HTML nodes are display: inline so we need to make
        // them block;
        setupVis['el'].style.display = "block";
        setupVis['style'] = {
          display: "inline-block"
        };
      };

      setupJS = function(){
        //setupVis['el'] = options.el;
      };

      // Copy global defaults on to this chart.
      each(chartstack.defaults, function(k, v){
        setupVis[v] = k;
      });

      if ('nodeType' in options){
        setupDom();
      } else {
        setupJS();
      }

      // Find properties on dom element to override defaults.
      // Support arrays here so we can store the data under a different name.
      // TODO: These strings should be objects with support for defaults and other options.

      dataAttributes = ['adapter', 'dataset', 'dataformat', 'dateformat'];
      initAttributes = ['library'];
      visualAttributes = ['title', 'labels', 'height', 'width', 'stacked'];

      // Prev:
      // titleTextColor, legendColor, colors, pieSliceBorderColor,
      // pieSliceTextColor, backgroundColor, customOptions, formatRowLabel

      each(initAttributes.concat(dataAttributes, visualAttributes), function(attr){
        var test, newKey;

        if (is(attr, 'object')){
          newKey = attr[1];
          attr = attr[0];
        }
        test = options.nodeType ? options.getAttribute(attr) : options[attr];
        // If property exists, save it.
        if (test){
          // Support for real booleans.
          if (test == 'false' || test == '0' || test == 'off'){
            test = false;
          } else if (test == 'true' || test == '1' || test == "on"){
            test = true;
          }

          if (newKey){
            mapAttribute(newKey, test);
          } else {
            mapAttribute(attr, test);
          }
        }
      });

      function mapAttribute(key, value){
        if (dataAttributes.indexOf(key) !== -1) {
          setupData[key] = value;
        } else if (initAttributes.indexOf(key) !== -1) {
          options[key] = value;
        } else {
          setupVis[key] = value;
        }
      }

      // If we don't have a localized library set on this chart then set the
      // global one.
      if (!options.library){
        options['library'] = chartstack.library;
      }

      if (options.visual instanceof chartstack.Visualization) {
        $chart.visual = options.visual;
      } else {
        $chart.visual = new chartstack.Libraries[options.library][options.chartType](setupVis);
      }


      // Check datasource starts with { or [ assume it's JSON or else
      // assume it's a URL to fetch.  We do not check for http anymore
      // as it can be a local/relative file.

      if (options.dataset instanceof chartstack.Dataset) {
        $chart.dataset = options.dataset;

      } else if (typeof setupData['dataset'] == 'string'){
        $chart.dataset = new chartstack.Dataset(setupData['dataset']);
        $chart.dataset.resources[0]['adapter'] = setupData['adapter'] || false;
        $chart.dataset.resources[0]['dataformat'] = setupData['dataformat'] || 'json';
        $chart.dataset.resources[0]['dateformat'] = setupData['dateformat'] || false;
      }

      $chart.dataset.on("complete", function(data){
        $chart.visual.trigger("update", data);
      });
      $chart.dataset.fetch();
    };

    setup();
  };

  Chart.prototype = {

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

    fetch : function(){
      this.dataset.fetch();
      //cb || (cb = function(){});
      //fetch(cb);
      return this;
    }

  };
  extend(Chart.prototype, Events);



  // -----------------------------
  // Private Methods
  // -----------------------------
  // Expose for plugin use
  // -----------------------------

  extend(chartstack, {
    is : is,
    each : each,
    extend : extend,
    noConflict : noConflict,
    ready: ready,
    get: get,
    addAdapter : addAdapter,
    parseDOM : parseDOM,
    parseParams: parseParams,
    buildQueryString: buildQueryString,
    getAjax : getAjax,
    getJSONP: getJSONP
  });


  // These three functions taken from:
  // https://github.com/spocke/punymce
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
    } else {
      for (var namespace in chartstack.Libraries) {
        if (namespace in window) {
          chartstack.library = namespace;
          break;
        }
      }
    }

    if (!chartstack.library){
      throw new Error('No charting library located.');
    }

    // Parse the dom.
    chartstack.parseDOM();
    isDomReady = true;

    each(readyCallbacks, function(cb){
      cb();
    });
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

  // Parse the DOM and search for valid charting elements to turn to classes.
  function parseDOM(){
    var registeredNodes = [], retrievedNodes;
    each(chartstack.Libraries, function(library){
      for (var key in library){
        if (registeredNodes.indexOf(key) == -1) {
          registeredNodes.push(key);
        }
      }
    });
    retrievedNodes = document.querySelectorAll(registeredNodes.join(','));
    each(retrievedNodes, function(el){
      // Ensure data attribute exists.
      if (el.getAttribute('dataset')){
        new Chart(el);
      }
    });
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

  function getJSONP(url, success, error){
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


  // Hack to support google charts.
  if (window.google){
    google.load('visualization', '1.0', {'packages':['corechart']});
    google.setOnLoadCallback(bootstrap);
  }else{
    document.addEventListener("DOMContentLoaded", bootstrap);
  }
})(this);
