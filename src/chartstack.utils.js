(function(chartstack) {
  /**
   * Main namespace for useful reuseable methods. Split into sub namespace categories.
   * @namespace
   * @static
   * @memberof chartstack
   */

  // Aliases.
  var each = chartstack.each;

  var utils = chartstack.utils = {};

  // Return a copy of a passed in object.
  utils.clone = function(obj){
    return JSON.parse(JSON.stringify(obj));
  };

  // Handy methods for modifying a data table.
  var table = utils.table = {};

  table.removeColumnByName = function(data, str){
    var matchNumber;

    match = data[0].indexOf(str);
    if (match > 0){
      each(data, function(rowAr){
        rowAr.splice(match, 1);
      });
    }
  };

  table.removeColumnByNumber = function(data, num){
    var match = data[0][num];
    if (match){
      table.removeColumnByName(data, match);
    }
  };

  table.removeRowByName = function(data, str){
    var i;
    for (i = data.length-1; i>=0; i--){
      if (data[i][0] === str){
        data.splice(i, 1);
      }
    }
  };

  table.removeRowByNumber = function(data, num){
    data.splice(num, 1);
  };

  table.addRow = function(){};
  table.addColumn = function(){};

  /**
   * https namespace for useful reuseable http methods.
   * @namespace
   * @static
   * @memberof chartstack.utils
   */
  var http = utils.http = {};

  /**
   * Utility method for an HTTP GET ajax call. Note: Must have CORS-support if doing cross-domain (see: http://enable-cors.org/) or use chartstack.utils.http.getJSONP.
   * @example
   * // returns text of HTML page.
   * chartstack.utils.http.getAjax('index.html', function(r){
   *   console.log('r', r);
   * });
   * @param {String} url - Relative or absolute HTTP or HTTPS url.
   * @param {Function} [cb] - Optional callback to recieve the successful response.
   * @name getAjax
   * @static
   * @function
   * @memberof chartstack.utils.http
   */
  http.getAjax = function(url, cb){
    var xhr;
    var createXHR = function(){
      var xhr;
      if (window.ActiveXObject){
        try{
          xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }catch(e){
          console.warn(e.message);
          xhr = null;
        }
      }else{
        xhr = new XMLHttpRequest();
      }
      return xhr;
    };

    xhr = createXHR();
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4){
        cb(xhr.responseText);
      }
    };
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
  };

  /**
   * Utility method for sending HTTP JSON-P requests.  Slightly more efficient if doing cross-domain requests as JSON-P does not need to do preflight HTTP OPTIONS calls.
   * @name getJSONP
   * @static
   * @function
   * @memberof chartstack.utils.http
   */
  http.getJSONP = function(url, success, error){
    var rand = +new Date;
    var callbackName = 'chartstack' + rand;
    var loaded = false;

    while (callbackName in window) {
      callbackName += "1";
    }
    window[callbackName] = function(response) {
      loaded = true;
      if (success && response) {
        success(response);
      }
      // Remove this from the namespace
      window[callbackName] = undefined;
      delete window[callbackName];
    };

    url = url + "&jsonp=" + callbackName;

    var script = document.createElement("script");
    script.id = "chartstack-jsonp";
    script.src = url;

    document.getElementsByTagName("head")[0].appendChild(script);

    // for early IE w/ no onerror event
    script.onreadystatechange = function() {
      if (loaded === false && this.readyState === "loaded") {
        loaded = true;
        if (error) {
          error();
        }
      }
    };

    // non-ie, etc
    script.onerror = function() {
      if (loaded === false) { // on IE9 both onerror and onreadystatechange are called
        loaded = true;
        if (error) {
          error();
        }
      }
    };
  };

})(chartstack);
