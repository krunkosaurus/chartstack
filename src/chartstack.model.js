(function(chartstack) {
  // Shortcuts
  var extend = chartstack.extend;
  var http = chartstack.utils.http;

  /**
   * Class that handles all data in Chartstack.  Can be used to fetch and normalize data as well as convert it to various formats acceptable by chart views.
   * @memberof chartstack
   * @static
   * @constructor
   */
  var Model = chartstack.Model = function(options){
    var self = this;
    extend(this, chartstack.defaults.model, options);

    // if options.data exists use it right away.
    if (options.data){
      this.trigger('update');
    }
  };

  extend(Model.prototype, {
    fetch: function(){
      var self = this;

      http.getAjax(self.url, function(r){
        self.rawData = JSON.parse(r);
        self.trigger('rawUpdate');

        if (self.poll){
          self.pollTimer = setTimeout(function(){
            self.fetch();
          }, self.poll);
        }
      });
    },

    stopPoll: function(){
      if (this.pollTimer){
        clearTimeout(this.pollTimer);
        this.pollTimer = false;
      }
    },

    restore: function(){
      // Restore data from original feteched data.
    }
  });

  // Add Events Mixin to Model.
  extend(Model.prototype, chartstack.Events);

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  chartstack.View.extend = Model.extend = function(protoProps, staticProps) {
    var parent = this;
    var child = function(){
      return parent.apply(this, arguments);
    };

    // Add static properties to the constructor function, if supplied.
    extend(child, parent, staticProps);

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

})(chartstack);
