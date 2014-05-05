/* jshint evil: true */
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

  Events = chartstack.Events = {

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
        if (callback && callback == events[i].callback) {
          this.listeners[name].splice(i, 1);
        }
        if (!callback || events.length === 0) {
          this.listeners[name] = void 0;
          delete this.listeners[name];
        }
      }
      return this;
    },

    trigger: function(name) {
      if (!this.listeners) {
        return this;
      }
      var args = Array.prototype.slice.call(arguments, 1);
      var events = this.listeners[name] || [];
      for (var i = 0; i < events.length; i++) {
        events[i].callback.apply(this, args);
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
    this.state = 'initialized';
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

  chartstack.Dataset = function(resource){
    var resources = [];
    if (resource instanceof Array) {
      each(resource, function(instance){
        resources.push(new chartstack.DataResource(instance));
      });
    } else {
      resources.push(new chartstack.DataResource(resource));
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
        self.resources[index].response = (is(response, 'string')) ? JSON.parse(response) : response;
        self.resources[index].state = 'synced';
        self.responses[index] = self.resources[index].response;
        completions++;
        if (completions == self.resources.length){
          self.transform();
        }
      };

      var error = function(){
        //console.log('error');
        return false;
      };

      each(self.resources, function(resource, index){

        if (resource.state == 'initialized' && resource.response !== void 0) {
          return finish(resource.response, index);

        } else if (resource.url) {
          var url = resource.url + buildQueryString(resource.params);
          var successSequencer = function(response){
            finish(response, index);
          };

          if (resource.state == 'initialized' && resource.response !== void 0) {
            //finish(resource.response, index);
          } else {
            chartstack.getAjax(url, successSequencer, error);
          }

          //chartstack.getAjax(url, successSequencer, error);
          //chartstack.getJSONP(url, successSequencer);

        } else {
          error();
        }
      });

      return self;
    },

    transform: function() {
      var self = this;
      each(self.resources, function(resource, index){
        var adapter = resource.adapter || 'default';
        var response = self.responses[index];
        if (adapter && chartstack.adapters[adapter]) {
          self.data[index] = chartstack.adapters[adapter].call(resource, response);
        } else {
          self.data[index] = response.data;
        }

      });
      self.trigger("complete", self.data[0]);
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

    self.chartOptions = self.chartOptions || {};
    self.height = self.height || chartstack.defaults.height;
    self.width = self.width || chartstack.defaults.width || self.el.offsetWidth;

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

  chartstack.libraries = {};

  chartstack.attributes = {
    data: ['adapter', 'dataset', 'dataformat', 'dateformat'],
    init: ['library'],
    masterVis: ['title', 'labels', 'height', 'width', 'colors'],
    customVis: []
  };

  chartstack.Visualization.register = function(name, methods, options){
    chartstack.libraries[name] = chartstack.libraries[name] || {};
    for (var method in methods) {
      chartstack.libraries[name][method] = methods[method];
    }
    if (options !== void 0 && options.attributes !== void 0) {
      each(options.attributes, function(attribute, index){
        if (chartstack.attributes.customVis.indexOf(attribute) == -1) {
          chartstack.attributes.customVis.push(options.attributes[index]);
        }
      });
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
    Visualization.prototype = new Surrogate();
    if (protoProps) {
      extend(Visualization.prototype, protoProps);
    }
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
    setupVis = { chartOptions: {} },
    setupData = {},
    options = args || {};

    // Add to internal array.
    chartstack.charts.push($chart);

    // Collects properties off DOM element and inspects data source.
    function setup(){
      var setupDom, setupJS, attrs = [];
      //var initAttributes, dataAttributes, visualAttributes;

      setupDom = function(){
        //$chart.el = args;
        setupVis.el = options;

        // Type of chart.
        options.chartType = setupVis.el.nodeName.toLocaleLowerCase();

        // Our made up HTML nodes are display: inline so we need to make
        // them block;
        setupVis.el.style.display = "block";
        setupVis.style = {
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

      // Prev:
      // titleTextColor, legendColor, colors, pieSliceBorderColor,
      // pieSliceTextColor, backgroundColor, customOptions, formatRowLabel

      attrs = attrs.concat(chartstack.attributes.data);
      attrs = attrs.concat(chartstack.attributes.init);
      attrs = attrs.concat(chartstack.attributes.masterVis);
      attrs = attrs.concat(chartstack.attributes.customVis);

      each(attrs, function(attr){
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

      function mapAttribute(key, val){
        var value = (typeof val === "string" && val.match(/^({|\[)/)) ? JSON.parse(val.replace(/'/g, "\"")) : val;
        if (chartstack.attributes.data.indexOf(key) !== -1) {
          setupData[key] = value;
        } else if (chartstack.attributes.init.indexOf(key) !== -1) {
          options[key] = value;
        } else if (chartstack.attributes.masterVis.indexOf(key) !== -1) {
          setupVis[key] = value;
        } else {
          setupVis.chartOptions[key] = value;
        }
      }

      // If we don't have a designated library...
      if (!options.library){
        if(options.chartType in chartstack.libraries[chartstack.library] || options.view instanceof chartstack.Visualization) {
          // Set global default if type matches
          options.library = chartstack.library;
        } else {
          // Select library with matching type
          each(chartstack.libraries, function(library, namespace){
            each(library, function(value, key){
              if (options.chartType == key) {
                options.library = namespace;
              }
            });
          });
        }
      }

      if (options.view instanceof chartstack.Visualization) {
        $chart.view = options.view;
      } else {
        $chart.view = new chartstack.libraries[options.library][options.chartType](setupVis);
      }


      // Check datasource starts with { or [ assume it's JSON or else
      // assume it's a URL to fetch.  We do not check for http anymore
      // as it can be a local/relative file.

      if (options.dataset instanceof chartstack.Dataset) {
        $chart.dataset = options.dataset;

      } else if (typeof options.dataset == 'string') {
        $chart.dataset = new chartstack.Dataset(options.dataset.replace(/(\r\n|\n|\r|\ )/g,""));
        $chart.dataset.resources[0].adapter = options.adapter || 'default';
        $chart.dataset.resources[0].dataformat = options.dataformat || 'json';
        $chart.dataset.resources[0].dateformat = options.dateformat || false;

      } else if (typeof setupData.dataset == 'string'){
        $chart.dataset = new chartstack.Dataset(setupData.dataset.replace(/(\r\n|\n|\r|\ )/g,""));
        $chart.dataset.resources[0].adapter = setupData.adapter || 'default';
        $chart.dataset.resources[0].dataformat = setupData.dataformat || 'json';
        $chart.dataset.resources[0].dateformat = setupData.dateformat || false;
      }

      $chart.dataset.on("complete", function(data){
        //console.log('data', this.data);
        $chart.view.data = this.data;
        $chart.view.trigger("update", data);
      });
      if (options.autoFetch || options.autoFetch == void 0) {
        $chart.dataset.fetch();
      }
      //
    }

    setup();

    $chart.on("download", function(){
      var c, svg = this.view.el.getElementsByTagName('svg');

      if (svg.length){
        svg = svg[0];
        c = new chartstack.Simg(svg);
        c.download();
      }
    });

    $chart.on("freeze", function(cb){
      var c, svg = this.view.el.getElementsByTagName('svg');
      cb = cb || function(){};

      if (svg.length){
        svg = svg[0];
        c = new chartstack.Simg(svg);
        c.replace(cb);
      }
    });

  };

  Chart.prototype = {
    show : function(){
      this.trigger('show');
      return this;
    },

    hide : function(){
      this.trigger('hide');
      return this;
    },

    draw: function(){
      this.trigger('draw');
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
    bootstrap : bootstrap,
    loadScript : loadScript,
    noConflict : noConflict,
    ready: ready,
    get: get,
    addAdapter : addAdapter,
    parseDOM : parseDOM,
    parseParams: parseParams,
    buildQueryString: buildQueryString,
    getAjax : getAjax,
    getJSONP: getJSONP,
    registerLibrary: registerLibrary,
    // Attach event for every chart we have.
    on: function(){
      var args = arguments;
      each(this.charts, function(chart){
        chart.on.apply(chart, args);
      });
    },
    // Trigger event for every chart we have.
    trigger: function(){
      var args = arguments;
      each(this.charts, function(chart){
        chart.trigger.apply(chart, args);
      });
    }
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

/*
  function preBootstrap(){
    setTimeout(function(){
      //console.log('chartstack.libraries', chartstack.libraries);
    },0);
    // TODO: Hard-coded support for Google Analytics for now.
    // document.addEventListener("DOMContentLoaded", bootstrap);
  }
*/

  // Called when DOM and chart libs are loaded and ready.
  function bootstrap (){
    // If graph library isn't set in defaults, match provider to the first graph
    // lib found on the page that we have an adapter for.
    if (chartstack.defaults.library){
      chartstack.library = chartstack.defaults.library;
    } else {
      for (var namespace in chartstack.libraries) {
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

    // Bring moment.js into the mix
    chartstack.moment = root.moment || false;
    if (chartstack.moment) {
      chartstack.moment.suppressDeprecationWarnings = true;
    }

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
        if (el == chart.view.el){
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
      //adapters.push({ name: domain, adapte: configObj }); // [domain] = configObj;
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

  // Register library to viz and data components.
  function registerLibrary(obj){
    // Create new chart namespace.
    var namespace = chartstack[obj.name] = {};
    var vizCharts = {};

    // For each chart type add it to the namespace.
    each(obj.charts, function(chart){
      var chartLow = chart.type.toLowerCase();
      var obj = extend(chart.events,{
        type: chartLow
      });
      // Instantiate new visualization object per chart.
      namespace[chart.type] = chartstack.Visualization.extend(obj);
      // Queue chart types to create new Visualization.
      vizCharts[chartLow] = namespace[chart.type];
    });

    // Register Visualization.
    chartstack.Visualization.register(obj.namespace, vizCharts, {
      attributes: obj.attributes
    });

    // If loadLib method exists it is called to load the graphic library.
    // Must execute passed callback when the library is loaded.
    // If loadLib does not exist, we assume the user loaded the library before
    // chartstack.js already (most cases).
    if ('loadLib' in obj){
      namespace.loaded = false;
      obj.loadLib(function(){
        namespace.loaded = true;
        chartstack.bootstrap();
      });

    }else{
      namespace.loaded = true;
      console.log('namespace', namespace);
    }
  }

  function loadScript(url, cb) {
    var doc = document;
    var handler;
    var head = doc.head || doc.getElementsByTagName("head");

    // loading code borrowed directly from LABjs itself
    setTimeout(function () {
      // check if ref is still a live node list
      if ('item' in head) {
        // append_to node not yet ready
        if (!head[0]) {
          setTimeout(arguments.callee, 25);
          return;
        }
        // reassign from live node list ref to pure node ref -- avoids nasty IE bug where changes to DOM invalidate live node lists
        head = head[0];
      }
      var script = doc.createElement("script"),
      scriptdone = false;
      script.onload = script.onreadystatechange = function () {
        if ((script.readyState && script.readyState !== "complete" && script.readyState !== "loaded") || scriptdone) {
          return false;
        }
        script.onload = script.onreadystatechange = null;
        scriptdone = true;
        cb();
      };
      script.src = url;
      head.insertBefore(script, head.firstChild);
    }, 0);

    // required: shim for FF <= 3.5 not having document.readyState
    if (doc.readyState === null && doc.addEventListener) {
      doc.readyState = "loading";
      doc.addEventListener("DOMContentLoaded", handler = function () {
        doc.removeEventListener("DOMContentLoaded", handler, false);
        doc.readyState = "complete";
      }, false);
    }
  }

  // Parse the DOM and search for valid charting elements to turn to classes.
  function parseDOM(){
    var registeredNodes = [], retrievedNodes;
    each(chartstack.libraries, function(library){
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

    while (!!(match=search.exec(query))) {
      urlParams[decode(match[1])] = decode(match[2]);
    }
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
      }
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
        if (error) {
          error();
        }
      }
    };
    // non-ie, etc
    script.onerror = function() {
      if (loaded === false) { // on IE9 both onerror and onreadystatechange are called
        loaded = true;
        if (error) {
          error();
        }
      }
    };
  }

  // preBootstrap();
})(this);
