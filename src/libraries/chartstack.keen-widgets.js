/* global google, chartstack */
(function(cs){
  var each = cs.each;
  var extend = cs.extend;

  // -----------------------------
  // Library Namespace
  // -----------------------------

  cs.Keen = cs.Keen || {};

  // -----------------------------
  // Type: Number
  // -----------------------------

  cs.Keen.Metric = cs.Visualization.extend({
    initialize: function(){
      var css = document.createElement("style");
      css.id = "cs-styles-keen-io";
      css.type = "text/css";
      css.innerHTML = "\
.cs-widget { \n  background: #49c5b1; \n  border-radius: 4px; \n  color: #fff; \n  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; \n  padding: 10px 0; \n  text-align: center; \n} \
.cs-widget-value { \n  display: block; \n  font-size: 84px; \n  font-weight: 700; \n  line-height: 84px; \n} \
.cs-widget-title { \n  display: block; \n  font-size: 24px; \n  font-weight: 200; \n}";
        // margin: 0 auto; \
      if (!document.getElementById("cs-styles-keen-io")) {
        document.body.appendChild(css);
      }

      this.render();
    },
    //render: function(){},
    update: function(){
      this.el.innerHTML = '' +
        '<div class="cs-widget keen-metric" style="width:' + parseInt(this.width) + 'px;">' +
          '<span class="cs-widget-value">' + this.data[0].table[1] + '</span>' +
          '<span class="cs-widget-title">' + (this.title || 'Result') + '</span>' +
        '</div>';
    }
  });


  // -----------------------------
  // Register Methods
  // -----------------------------

  cs.Visualization.register("keen-io", {
    "metric": cs.Keen.Metric
  });

})(chartstack);
