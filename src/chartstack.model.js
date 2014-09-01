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

    // Allow new operator to be optional.
    if (!(self instanceof Model)){
      return new Model(options);
    }

    // Extend default options with passed options.
    options = extend({}, Model.defaults, options);

    // Copy over allowed options.
    each(['url', 'adapter', 'pollInterval'], function(prop){
      if (prop in options){
        self[prop] = options[prop];
      }
    });

    this.on('originalUpdate', function(){
      self.refreshData();
    });

    this.on('update', function(){
      self.trigger('transform');
    });

    // this.on('transform', function(){});

    if (options.data){
      this.set(options.data);
    }
  };

  // Static placeholder for model defaults.
  Model.defaults = {
    pollInterval: 0,
    pollCount: 0
  };

  Model.adapters = {};

  // Adapters that normalize 3rd party api to a standard format.
  Model.addAdapter = function(domain, configObj){
    var namespace = Model.adapters[domain] = {};

    each(configObj, function(func, type){
      namespace[type] = func;
    });
  }

  // Load data from across the internet from .url
  extend(Model.prototype, {
    set: function(data){
      this.originalData = data;
      this.trigger('originalUpdate');
      return this;
    },

    clear: function(){
      if (this.listeners){
        delete this.listeners;
      }
      return this;
    },

    refreshData: function(){
      // Make copy of original data.
      var dataCopy = utils.clone(this.originalData);
      var adapter;

      // Check to see if adapter is specified.
      // TODO: Currently only supports time series type: "all".
      if (this.adapter && this.adapter in Model.adapters){
        adapter = Model.adapters[this.adapter];
        if (adapter.all){
          dataCopy = adapter.all(dataCopy);
        }
      }

      this.data = dataCopy;

      // Trigger update.
      this.trigger('update');
    },

    reset: function(){
      this.clear();
      this.refreshData();
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
              self.pollCount++;
              self.trigger('polling');
            }, self.pollInterval);
          }
        });
      }

      return this;
    },

    stopPoll: function(){
      if (this.pollTimer){
        clearTimeout(this.pollTimer);
      }
      this.pollInterval = 0;
    },

    filterRows: function(selector){
      var self = this;
      var action = function(){
        var data = self.data;
        // If we were passed an array of column titles...
        if (selector instanceof Array){
          for (var len = data.length-1; len>=0; len--){
            var rowTitle = data[len][0];
            var match = selector.indexOf(rowTitle);
            if (match !== -1){
              table.removeRowByName(data, rowTitle);
            }
          }
        // TODO: Argument string support.
        }else{}
      }

      // Run the action if data is ready.
      if (this.data){
        action();
      }

      // Queue action for future data updates.
      this.on('transform', action);
      return this;
    },

    sortColumns: function(selector){
      var self = this;
      var action = function(){
        var data = self.data;
        // If we were passed an array of column titles...
        if (selector instanceof Array){
              table.sortColumns(data, selector);

        // TODO: Argument string support.
        }else{}
      }

      // Run the action if data is ready.
      if (this.data){
        action();
      }

      // Queue action for future data updates.
      this.on('transform', action);
      return this;
    },

    filterColumns: function(selector){
      var self = this;
      var action = function(){
        var data = self.data;
        // If we were passed an array of column titles...
        if (selector instanceof Array){
          for (var len = data[0].length-1; len>=0; len--){
            var columnTitle = data[0][len];
            var match = selector.indexOf(columnTitle);
            if (match !== -1){
              table.removeColumnByName(data, columnTitle);
            }
          }

        // TODO: Argument string support.
        }else{}
      }

      // Run the action if data is ready.
      if (this.data){
        action();
      }

      // Queue action for future data updates.
      this.on('transform', action);
      return this;
    },

    onlyRows: function(selector){
      var self = this;
      var action = function(){
        var data = self.data;
        // If we were passed an array of column titles...
        if (selector instanceof Array){
          for (var len = data.length-1; len>=1; len--){
            var rowTitle = data[len][0];
            var match = selector.indexOf(rowTitle);
            if (match === -1){
              table.removeRowByName(data, rowTitle);
            }
          }

        // TODO: Argument string support.
        }else{}
      }

      // Run the action if data is ready.
      if (this.data){
        action();
      }

      // Queue action for future data updates.
      this.on('transform', action);
      return this;
    },

    // Filter data down to a passed array of matched columns titles.
    onlyColumns: function(selector){
      var self = this;
      var action = function(){
        var data = self.data;
        // If we were passed an array of column titles...
        if (selector instanceof Array){
          for (var len = data[0].length-1; len>=0; len--){
            var columnTitle = data[0][len];
            var match = selector.indexOf(columnTitle);
            if (match === -1){
              table.removeColumnByName(data, columnTitle);
            }
          }

        // TODO: Argument string support.
        }else{}
      }

      // Run the action if data is ready.
      if (this.data){
        action();
      }

      // Queue action for future data updates.
      this.on('transform', action);
      return this;
    },

    addRows: function(newRows){
      var self = this;
      var action = function(){
        var data = self.data;
        var validLength = self.data[0].length;

        each(newRows, function(row){
          if (row.length === validLength){
            data.push(row);
          }else{
            // TODO: Trigger event error.
            throw new Error('.addRows: Invalid length. Expected ' + validLength + ' got ' + row.length + '.');
          }
        });
      }

      // Run the action if data is ready.
      if (this.data){
        action();
      }

      // Queue action for future data updates.
      this.on('transform', action);
      return this;
    },

    addColumns: function(newColumns){
      var self = this;
      var action = function(){
        var data = self.data;
        var validLength = self.data.length;


        each(newColumns, function(row){
          if (row.length === validLength){
            table.addColumn(data, row);
          }else{
            // TODO: Trigger event error.
            throw new Error('.addColumns: Invalid length');
          }
        });
      }

      // Run the action if data is ready.
      if (this.data){
        action();
      }

      // Queue action for future data updates.
      this.on('transform', action);
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
