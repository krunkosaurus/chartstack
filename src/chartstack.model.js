(function(chartstack) {
  // Shortcuts
  var extend = chartstack.extend;
  /**
   * Class that handles all data in Chartstack.  Can be used to fetch and normalize data as well as convert it to various formats acceptable by chart views.
   * @memberof chartstack
   * @static
   * @constructor
   */
  var Model = chartstack.Model = function(options){
    extend(this, chartstack.defaults.model, options);

    // if options.data exists use it right away.

    // If options.url exists fetch it and trigger fetch
    if (options.url){

    }
    //
  };

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
