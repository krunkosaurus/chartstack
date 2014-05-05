/* global google, chartstack */
(function(cs){
  cs.registerLibrary({
    name: 'Keen',
    namespace: 'keen-io',
    charts: [{
      type : 'Metric',
      events: {
        initialize: function(){
          var css = document.createElement("style");
          css.type = "text/css";
          css.innerHTML = ".cs-widget { \
            background: #49c5b1; \
            border-radius: 4px; \
            color: #fff; \
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; \
            padding: 10px 0; \
            text-align: center; \
          } \
          .cs-widget-title { \
            display: block; \
            font-size: 84px; \
            font-weight: 700; \
            line-height: 84px; \
          } \
          .cs-widget-subtitle { \
            display: block; \
            font-size: 24px; \
            font-weight: 200; \
          }";
          // margin: 0 auto; \
          document.body.appendChild(css);

          this.render();
        },

        update: function(){
          this.el.innerHTML = '' +
            '<div class="cs-widget cs-number" style="width:' + parseInt(this.width) + 'px;">' +
            '<span class="cs-widget-title">' + this.data[0].table[1] + '</span>' +
            '<span class="cs-widget-subtitle">' + (this.title || 'Result') + '</span>' +
            '</div>';
        }
      }
    }]
  });

})(chartstack);
