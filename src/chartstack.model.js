(function(chartstack) {
  // Aliases
  var extend = chartstack.extend;
  var utils = chartstack.utils;
  var http = utils.http;
  var each = chartstack.each;
  var table = chartstack.utils.table;

  /**
   * Class that handles all data in Chartstack.  Can be used to fetch and normalize data as well as convert it to specific formats acceptable by specific chart views.
   * @memberof chartstack
   * @static
   * @constructor
   */
  var Model = chartstack.Model = function(options){
    var self = this;

    // Extend default options with passed options.
    extend(this, Model.defaults, options);

    if (options.data){
      this.set(options.data);
    }

    this.on('originalUpdate', function(){
      // Make copy of original data.
      var dataCopy = utils.clone(self.originalData);

      // Check to see if adapter is specified.
      // If so, transform the data.

      self.data = dataCopy;

      // Trigger update.
      self.trigger('update');
    });

    this.on('update', function(){
      self.trigger('transform');
    });

    // this.on('transform', function(){});
  };

  // Static placeholder for model defaults.
  Model.defaults = {
    pollInterval: 0
  };

  // Load data from across the internet from .url
  extend(Model.prototype, {
    set: function(data){
      var self = this;

      this.originalData = data;
      setTimeout(function(){
        self.trigger('originalUpdate');
       },0);
    },

    fetch: function(){
      var self = this;

      if (self.url){
        http.getAjax(self.url, function(r){
          var data = JSON.parse(r);

          // If data is a child node use it.
          if (data.data){
            data = data.data;
          }
          // Set the data.
          self.set(data);

          if (self.pollInterval !== 0){
            self.pollTimer = setTimeout(function(){
              self.fetch();
            }, self.pollInterval);
          }
        });
      }

      return this;
    },

    stopPoll: function(){
      if (this.pollTimer){
        clearTimeout(this.pollTimer);
        this.pollTimer = 0;
      }
    },

    // Filter data down to a passed array of matched columns titles.
    onlyColumns: function(selector){

      this.on('transform', function(){
        var data = this.data;

        // If we were passed an array of column titles...
        if (selector instanceof Array){
          each(data[0], function(columnTitle){
            var match = selector.indexOf(columnTitle);
            if (match === -1){
              table.removeColumnByName(data, columnTitle);
            }
          });

        }else{
          // TODO: Check if its a string and parse.
        }
      });
      return this;
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
