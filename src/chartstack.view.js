(function(chartstack) {
  // Shortcuts
  var extend = chartstack.extend;
  var each = chartstack.each;

  /**
   * Base class of all chart views. To be extended but not instantiated directly.
   * @param {object} options - Options object contains various data to instantiate a chart.
   * @classdesc This class is subclassed to create a new type of view class.
   * @memberof chartstack
   * @static
   * @constructor
   */
  var View = chartstack.View = function(options){
    var self = this;
    options = options || {};

    // Extend default options with passed options.
    extend(this, View.defaults);

    each(['width', 'height', 'labels', 'library', 'colors'], function(prop){
      if (prop in options){
        self[prop] = options[prop];
      }
    });
  };

  // Static placeholder for view defaults.
  View.defaults = {
    width: 400,
    height: 200,
    labels: true,
    // Default library.
    library: 'Google Charts',
    colors: ['red', 'yellow', 'blue', 'green', 'purple']
  };

  // Add Events Mixin to View.
  extend(View.prototype, chartstack.Events);

  // Hack to support google charts as it can only be dynamically loaded
  // and must be called before DOM-ready.
  if (window.google){
    google.load('visualization', '1.0', {'packages':['corechart']});
    google.setOnLoadCallback(function(){
      chartstack.trigger('ready');
    });
  }else{
    document.addEventListener("DOMContentLoaded", function(){
      chartstack.trigger('ready');
    });
  }
})(chartstack);
