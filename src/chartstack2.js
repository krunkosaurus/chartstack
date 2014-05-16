/* jshint evil: true */
(function(root) {
  var previousChartstack = root.chartstack;
  /**
   * The main chartstack object and namespace.
   * @namespace chartstack
   */
  var chartstack = root.chartstack = {};

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
   * @param {object} e - The object that will be extended on to the first object.
   * @returns {object} Returns original first object with the second object extended on to it.
   * @memberof chartstack
   * @static
   * @function
   */
  function extend(o, e){
    each(e, function(v, n){
      o[n] = v;
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

  /**
   * Base class of all chart views. To be extended but not instantiated directly.
   * @param {object} options - Options object contains various data to instantiate a chart.
   * @classdesc This class is subclassed to create a new type of view class.
   * @memberof chartstack
   * @static
   * @constructor
   */
  chartstack.View = function(options){
    //
  };

  /**
   * Class that handles all data in Chartstack.  Can be used to fetch and normalize data as well as convert it to various formats acceptable by chart views.
   * @memberof chartstack
   * @static
   * @constructor
   */
  chartstack.Model = function(options){
    //
  };

  chartstack.noConflict = function(){
    root.chartstack = previousChartstack;
    return this;
  };

  chartstack.addView = function(options){
    //
  };

  extend(chartstack, {
    is : is,
    each : each,
    extend : extend
  });

})(this);
