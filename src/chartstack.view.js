(function(chartstack) {
  // Shortcuts
  var extend = chartstack.extend;

  /**
   * Base class of all chart views. To be extended but not instantiated directly.
   * @param {object} options - Options object contains various data to instantiate a chart.
   * @classdesc This class is subclassed to create a new type of view class.
   * @memberof chartstack
   * @static
   * @constructor
   */
  var View = chartstack.View = function(options){
    extend(this, chartstack.defaults.view, options);
    //
  };

  // Static placeholder for view defaults.
  View.defaults = {
    width: 400,
    height: 200,
    labels: true,
    library: 'Google Charts',
    colors: ['red', 'yellow', 'blue', 'green', 'purple']
  };

  // Add Events Mixin to View.
  extend(View.prototype, chartstack.Events);
})(chartstack);
