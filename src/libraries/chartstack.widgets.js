/* global google, chartstack */
(function(cs){
  var each = cs.each;
  var extend = cs.extend;

  // -----------------------------
  // Library Namespace
  // -----------------------------

  cs.Widgets = cs.Widgets || {};

  // -----------------------------
  // Type: Number
  // -----------------------------

  cs.Widgets.Metric = cs.Visualization.extend({
    update: function(data){
      var css = document.createElement("style"),
       widget = document.createElement('div');

      css.type = "text/css";
      css.innerHTML = ".cs-widget {
          background: #49c5b1;
          border-radius: 4px;
          color: #fff;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          padding: 10px 0;
          text-align: center;
        }
        .cs-widget-title {
          display: block;
          font-size: 84px;
          font-weight: 700;
          line-height: 84px;
        }
        .cs-widget-subtitle {
          display: block;
          font-size: 24px;
          font-weight: 200;
        }";
      document.body.appendChild(css);

      widget.innerHTML = '<div class="cs-widget cs-number">' +
          '<span class="cs-widget-title">' + data[1][1] + '</span>' +
          '<span class="cs-widget-subtitle">' + (this.chartOptions.title || 'Result') + '</span>' +
        '</div>';
      while (widget.firstChild) {
        this.el.appendChild(widget.firstChild);
      }

    }
  });


  // -----------------------------
  // Register Methods
  // -----------------------------

  cs.Visualization.register("widgets", {
    "metric": cs.Widgets.Metric
  });

})(chartstack);
