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
   * @param {string} [t='undefined'] - The type we want to check against.
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
   * @returns {boolean} Returns 1 if operation is successful and 0 if not.
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
   * Base class of all chart views. To be extended but not instantiated directly.
   * @param {object} options - Options object contains various data to instantiate a chart.
   * @classdesc This class is subclassed to create a new type of view class.
   * @memberof chartstack
   * @static
   * @constructor
   */
  chartstack.Chart = function(options){
    //
  };

  chartstack.noConflict = function(){
    root.chartstack = previousChartstack;
    return this;
  };

  /**
   * Event class of all chart views. To be extended but not instantiated directly.
   * @param {object} options - Options object contains data to instantiate the chart.
   * @memberof chartstack
   * @static
   * @mixin
   */
  chartstack.Events = {};

  chartstack.addView = function(options){
    //
  };

  extend(chartstack, {
    is : is,
    each : each,
    extend : extend
  });

})(this);
