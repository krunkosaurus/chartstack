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

    // Extend default options with passed options.
    options = extend({}, View.defaults, options);

    // Copy over allowed options.
    each([
      // Properties
      // ==========
      'el', 'library',
      // Content properties
      'title',
      // Size properties
      'width', 'height',
      // Display properties
      'labels',
      // Style properties
      'backgroundColor', 'titleTextColor', 'legendColor',
      'pieSliceBorderColor', 'pieSliceTextColor', 'colors',
      // Special properties
      'libOptions',

      // Other properties
      // =====
      'model',
      'chartType'
    ], function(prop){
      if (prop in options){
        self[prop] = options[prop];
      }
    });

    // Set the element node.
    if (typeof options.el == 'string'){
      self.el = document.querySelector(options.el);
    }else{
      self.el = options.el;
    }

    // If model is passed, lets fetch it's data.
    // TODO: Check for inline data first.
    if (this.model){
      this.model.on('update', function(){
        self.data = chartstack.adapters.google(self.model.data);
        chartFunc(this, this.data);
        self.draw();
      });
    }
  };

  extend(View.prototype, {

    // Todo: Consider is draw causes fetch if no data found.
    draw: function(){
      console.log('draw!', this.data, this);
      var self = this;
      var lib = chartstack.libraries[this.library];
      var chartFunc = lib[this.chartType];

      if (this.data){
        chartFunc(this, this.data);
      }

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

  // Static placeholder for View instance defaults.
  View.defaults = {
    title: '',
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
