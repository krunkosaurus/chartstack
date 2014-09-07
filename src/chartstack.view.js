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
      'el',
      'library',
      'chartType'
    ], function(prop){
      if (prop in options){
        self[prop] = options[prop];
      }
    });

    // Set the element node. Find it if needed.
    if (options.el){
      if (typeof options.el == 'string'){
        self.el = document.querySelector(options.el);

        // Validate element
        if (!(self.el && self.el.nodeType == 1)){
          throw new Error('Element does not exist: ' + options.el);
        }
      }else{
        self.el = options.el;
      }
    }else{
      throw new Error('el property required in new view.');
    }

    // If model is passed, lets fetch it's data.
    if (options.model){

      // If inline array instead of model, convert it.
      if (options.model instanceof Array){
        options.model = new chartstack.Model({
          data: options.model
        });
      }

      this.attachModel(options.model);
    }
  };

  extend(View.prototype, {

    // Todo: Consider is draw causes fetch if no data found.
    draw: function(){
      var self = this;

      var lib = chartstack.libraries[this.library];
      var callChart = function(){
        lib[self.chartType](self, self.data);
        self.trigger('drawn');
      }

      // If this view has data when draw is called, use it.
      // If this view has no data but a model object embedded, subscribe once
      // to it's update event to draw.
      if (self.data){
        callChart();
      }else if (self.model){
        self.one('update', function(){
          callChart();
        });
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
    },

    // Used by both model update and direct data for converting data to specific
    // chart format.
    _conformData: function(){
        // self.data = chartstack.adapters.google(self.model.data);
        this.data = chartstack.adapters[this.library](this.model.data);
        this.trigger('update');
    },

    // Method to attach and setup event listeners
    attachModel: function(model){
      var self = this;

      // Keep reference to this model in the view.
      self.model = model;

      // Keep reference to this view in the model.
      // model.view = self;

      if (model.url){
        model.on('update', function(){
          self._conformData();
        });

        model.fetch();
      }else{
        self._conformData();
      }
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
    colors: ['#00afd7', '#49c5b1', '#f35757', '#e9c054', '#6a6aa6', '#8a9eb1', '#c1cbd6']
  };

  // Add Events Mixin to View.
  extend(View.prototype, chartstack.Events);
})(chartstack);
