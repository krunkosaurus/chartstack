/* jshint evil: true */
(function(root) {
  var previousChartstack = root.chartstack;
  /**
   * The main chartstack object and namespace.
   * @namespace chartstack
   */
  var chartstack = root.chartstack = {};

  /**
   * Global options object that is passed to chart instance constructors for settings defaults such as color and chart width/height.  You can override this object before the DOM-ready event.  Chart specific config objects override these defaults.
   * @namespace
   * @static
   * @memberof chartstack
   * @property {Object}  defaults
   * @property {Boolean} [default.labels] - If set to true all charts try to use labels.
   * @property {String} [default.library] - The default charting Library to use if none specified.
   * @property {Array} [default.colors] - The colors of each item in each data series.  Affects all chart types from piecharts to barcharts.
   */
  var defaults = chartstack.defaults = {
    labels: true,
    library: 'Google Charts',
    colors: ['red', 'yellow', 'blue', 'green', 'purple']
  };

  /**
   * Namespace for transformer methods.  Transformers are simple methods that convert one data type into JSON.
   * @namespace
   * @static
   * @memberof chartstack
   * @property {Object} transformers
   * @property {Function} transformers.json - Converts "string" JSON in to live JSON.
   * @property {Function} transformers.csv - Converts CSV data to JSON.
   */
  var transformers = chartstack.transformers = {
    json : function(data){
      if (typeof data == 'string'){
        return JSON.parse(data);
      }else{
        return data;
      }
    }
  };

  /**
   * Utility method for comparing types between two arguments. Internally uses JavaScript's typeof.
   * @example
   * // returns true
   * chartstack.is({a:1}, 'object');
   * @param {*} o - The object we want to check the type of.
   * @param {String} [t='undefined'] - The type we want to check against.
   * @returns {Boolean} Boolean of whether o is of type t.
   * @static
   * @memberof chartstack
   */
  function is(o, t){
    o = typeof(o);
    if (!t){
      return o != 'undefined';
    }
    return o == t;
  }

  /**
   * Utility method for iterating on both objects and arrays.
   * @example
   * // returns:
   * // a 0 ["a", "b", "c"]
   * // b 1 ["a", "b", "c"]
   * // c 2 ["a", "b", "c"]
   * chartstack.each(['a','b','c'], function(val, key, list){
   *   console.log(val, key, list);
   * });
   * @example
   * // returns:
   * // 11 "a" {a: 11, b: 22, c: 33}
   * // 22 "b" {a: 11, b: 22, c: 33}
   * // 33 "c" {a: 11, b: 22, c: 33}
   * chartstack.each({a:11, b:22, c:33}, function(val, key, list){
   *   console.log(val, key, list);
   * });
   * @param {Object|Array} o - The type we want to check against.
   * @param {Function} cb - The callback to execute for each item in the array or object.
   * @param {Object} [s] - The scope to call the callback with. Defaults to o.
   * @returns {Boolean} Returns 1 if operation is successful and 0 if not.
   * @static
   * @memberof chartstack
   */
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
  /**
   * Utility method for extending the properties of one object on to another.
   * @example
   * // returns:
   * // {a: 1, b: 2, c: 3}
   * chartstack.extend({a:1,b:2},{c:3});
   * @param {object} o - The object to be extended.
   * @param {...object} [*] - An unlimited list of object that will be extended on to the first object.  Extending happens right to left so that the properties in last argument overwrites properties of the same name from the second-to-last, etc.
   * @returns {object} Returns original first object with the second object extended on to it.
   * @memberof chartstack
   * @static
   * @function
   */
  function extend(o){
    var args = [].slice.call(arguments, 0).slice(1);
    each(args, function(v, k, all){
      each(all[k], function(v, k){
        o[k] = v;
      });
    });
    return o;
  }

  /**
   * Mixin that can be added to any object to enable event support. Events are scoped to the object this mixin is extending.  chartstack.view and chartstack.model instances use this mixin to trigger certain events you can subscribe to.
   * @memberof chartstack
   * @static
   * @mixin
   */
  var Events = chartstack.Events = {
    /**
     * Method for subscribing to an event and executing a callback.
     * @example
     * bob = {};
     * chartstack.extend(bob, chartstack.Event);
     * bob.on('talk', function(words){
     *    console.log(words);
     * });
     * bob.trigger('talk', 'Hello there!');
     * @param {String} name - The event to subscribe to. If the event does not exist it will be created.
     * @param {Function} callback - The function to be executed when this event is triggered.  The event is triggered in the context (scope) of the object that this  method is attached to.
     * @returns {object} Returns the object this method is attached to.
     * @memberof chartstack.Events
     * @method
     * @static
     */
    on: function(name, callback) {
      this.listeners || (this.listeners = {});
      var events = this.listeners[name] || (this.listeners[name] = []);
      events.push({callback: callback});
      return this;
    },

    /**
     * Method for unsubscribing to an event.
     * @example
     * bob = {};
     * chartstack.extend(bob, chartstack.Event);
     * bob.on('talk', function(words){
     *    console.log(words);
     * });
     * bob.trigger('talk', 'Hello there!');
     * prints: Hello there!
     * bob.off('talk');
     * bob.trigger('talk', 'Hello there!');
     * // Outputs nothing.
     * @param {String} [name] - The event to unsubscribe to. If no event name is passed then all events and their associated callbacks are removed from this object.
     * @param {Function} [callback] - The optional callback to be removed. If no callback is passed then all callbacks queued for this event are removed from this object.
     * @returns {object} Returns the object this method is attached to.
     * @memberof chartstack.Events
     * @method
     * @static
     */
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

    /**
     * Method for triggering an event.  An unlimited number of arguments can be passed after the first agument which will be passed to every callbacks subscribed to this object's event.
     * @example
     * bob = {};
     * chartstack.extend(bob, chartstack.Event);
     * bob.on('talk', function(words){
     *    console.log(words);
     * });
     * bob.trigger('talk', 'Hello there!');
     * prints: Hello there!
     * @param {String} [name] - The name of the event to trigger.
     * @param {...*} [*] - An unlimited number of optional arguments.
     * @returns {object} Returns the object this method is attached to.
     * @memberof chartstack.Events
     * @method
     * @static
     */
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

  // Enable the main chartstack namespace to function as a global event bus.
  extend(chartstack, Events);

  /**
   * Method for queueing a callback to trigger when Chartstack has fully loaded and the DOM is ready.  Is actually just a shortcut for chartstack.on('ready', cb);
   * @param {Function} [cb] - The callback to trigger when the chartstack is ready.
   * @returns {object} Returns a reference to the global chartstack instance.
   * @memberof chartstack
   * @method
   * @static
   */
  // Shortcut for chartstack.on('ready', cb);
  var ready = chartstack.ready = function(cb){
    chartstack.on('ready', cb);
    return chartstack;
  };

  /**
   * Base class of all chart views. To be extended but not instantiated directly.
   * @param {object} options - Options object contains various data to instantiate a chart.
   * @classdesc This class is subclassed to create a new type of view class.
   * @memberof chartstack
   * @static
   * @constructor
   */
  var View = chartstack.View = function(options){
    //
  };

  /**
   * Class that handles all data in Chartstack.  Can be used to fetch and normalize data as well as convert it to various formats acceptable by chart views.
   * @memberof chartstack
   * @static
   * @constructor
   */
  var Model = chartstack.Model = function(options){
    //
  };


  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  View.extend = Model.extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && 'constructor' in protoProps) {
      child = protoProps.constructor;
    } else {
      child = function(){
        return parent.apply(this, arguments);
      };
    }

    // Add static properties to the constructor function, if supplied.
    extend(child, extend(parent, staticProps));
    //extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){
      this.constructor = child;
    };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps){
      extend(child.prototype, protoProps);
    }

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  chartstack.noConflict = function(){
    root.chartstack = previousChartstack;
    return this;
  };

  chartstack.addView = function(options){
    //
  };

  // Expose globally.
  extend(chartstack, {
    is : is,
    each : each,
    extend : extend
  });

})(this);
