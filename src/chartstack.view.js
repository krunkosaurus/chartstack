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

    // Allow new operator to be optional.
    if (!(self instanceof View)){
      return new View(options);
    }

    options = options || {};

    // Extend default options with passed options.
    extend(this, View.defaults);

    // Copy over allowed options.
    each([
      // Properties
      'el', 'library',
      // Content properties
      'title',
      // Size properties
      'width', 'height',
      // Style properties
      'backgroundColor', 'titleTextColor', 'legendColor',
      'pieSliceBorderColor', 'pieSliceTextColor', 'colors',
      // Special properties
      'libOptions'
    ], function(prop){
      if (prop in options){
        self[prop] = options[prop];
      }
    });
  };

  extend(View.prototype, {
    draw: function(data){
      console.log('draw!');
      return this;
    },
    formatRowLabel: function(data){
      console.log('formatRowLabel!');
      return this;
    },
    formatColumnLabel: function(data){
      console.log('formatColumnLabel!');
      return this;
    },
    freeze: function(data){
      console.log('freeze!');
      return this;
    },
    unfreeze: function(data){
      console.log('unfreeze!');
      return this;
    },
    download: function(data){
      console.log('download!');
      return this;
    }
  });

  // Static placeholder for view defaults.
  View.defaults = {
    width: 400,
    height: 200,
    labels: true,
    // Default library.
    library: 'google',
    colors: ['red', 'yellow', 'blue', 'green', 'purple']
  };

  // Add Events Mixin to View.
  extend(View.prototype, chartstack.Events);
})(chartstack);
