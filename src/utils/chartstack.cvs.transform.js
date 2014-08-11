/* global chartstack */
(function(cs){
  // Taken from: https://github.com/aaronsnoswell/csvjson.js/blob/master/csvjson.js
  cs.addTransformer('csv', function(data){
    /**
     * splitCSV function (c) 2009 Brian Huisman, see http://www.greywyvern.com/?post=258
     * Works by spliting on seperators first, then patching together quoted values
     */
    function splitCSV(str, sep) {
      for (var foo = str.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
        if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
          if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
            foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
          } else if (x) {
            foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
          } else {
            foo = foo.shift().split(sep).concat(foo);
          }
        } else {
          foo[x].replace(/""/g, '"');
        }
      }
      return foo;
    }

    /**
     * Converts from CSV formatted data (as a string) to JSON returning
     * an object.
     * @required csvdata {string} The CSV data, formatted as a string.
     * @param args.delim {string} The delimiter used to seperate CSV
     * items. Defauts to ','.
     * @param args.textdelim {string} The delimiter used to wrap text in
     * the CSV data. Defaults to nothing (an empty string).
     */
    function csv2json(csvdata, args) {
      args = args || {};
      var delim = chartstack.is(args.delim, 'undefined') ?  ',' : args.delim;
      // Unused
      //var textdelim = isdef(args.textdelim) ? args.textdelim : "";

      var csvlines = csvdata.split("\n");
      var csvheaders = splitCSV(csvlines[0], delim);
      var csvrows = csvlines.slice(1, csvlines.length);

      var ret = {};
      ret.headers = csvheaders;
      ret.rows = [];

      for(var r in csvrows) {
        if (csvrows.hasOwnProperty(r)) {
          var row = csvrows[r];
          var rowitems = splitCSV(row, delim);

          // Break if we're at the end of the file
          if(row.length === 0){
            break;
          }

          var rowob = {};
          for(var i in rowitems) {
            if (rowitems.hasOwnProperty(i)) {
              var item = rowitems[i];

              // Try to (intelligently) cast the item to a number, if applicable
              if(!isNaN(item*1)) {
                item = item*1;
              }

              rowob[csvheaders[i]] = item;
            }
          }

          ret.rows.push(rowob);
        }
      }

      return ret;
    }// end csv2json

    return csv2json(data);
  });
}(chartstack));
