/* global chartstack */
/* jshint camelcase: false */
(function(cs){
  var proto;
  var each = chartstack.each;

  cs.dataform = function(data, map) {
    this.build(data, map);
  };

  proto = cs.dataform.prototype;

  proto.build = function(data, map) {

    // map.root
    // map.each.index
    // map.each.label
    // map.each.value

    var self = this,
    root = data[map.root];

    self.map = map,
    self.table = [],
    self.series = [],
    self.raw = data;

    self.cols = (function(){
      var split_index = self.map.each.index.split(" -> ");
      var split_value = self.map.each.value.split(" -> ");
      var output = {
        fixed: [split_index[split_index.length-1]]
      };
      if (self.map.each.label) {
        output.cells = self.map.each.label.split(" -> ");
      } else {
        output.fixed.push(split_value[split_value.length-1]);
      }
      return output;
    })();

    self.rows = {
      index: self.map.each.index.split(" -> "),
      cells: self.map.each.value.split(" -> ")
    };

    self.order = {
      rows: self.map.sort.index || 'asc',
      cols: self.map.sort.label || 'desc',
    };

    // SORT ROWS
    if (self.order.rows.length > 0) {
      root.sort(function(a, b){
        var aIndex = parse.apply(self, [a].concat(self.rows.index));
        var bIndex = parse.apply(self, [b].concat(self.rows.index));

        if (self.order.rows == 'asc') {
          if (aIndex > bIndex){return 1;}
          if (aIndex < bIndex){return -1;}
          return 0;
        } else {
          if (aIndex > bIndex){return -1;}
          if (aIndex < bIndex){return 1;}
          return 0;
        }

        return false;
      });
    }

    // ADD SERIES
    (function(){
      self.cols.label = (self.cols.fixed) ? self.cols.fixed[0] : 'series';
      var fixed = (self.cols.fixed) ? self.cols.fixed : [];
      var cells = (self.cols.cells) ? parse.apply(self, [root[0]].concat(self.cols.cells)) : [];
      var output = fixed.concat(cells);
      output.splice(0,1);
      each(output, function(el){
        self.series.push({ key: el, values: [] });
      });
    })();

    // ADD SERIES' RECORDS
    each(root, function(el){
      var index = parse.apply(self, [el].concat(self.rows.index));
      var cells = parse.apply(self, [el].concat(self.rows.cells));

      each(cells, function(cell, j){
        var output = {};
        output[self.cols.label] = index[0];
        output.value = cell;
        self.series[j].values.push(output);
      });
    });

    // SORT COLUMNS
    if (self.order.cols.length > 0) {
      self.series = self.series.sort(function(a, b){
        var aTotal = 0;
        var bTotal = 0;
        each(a.values, function(record){
          aTotal += record.value;
        });
        each(b.values, function(record){
          bTotal += record.value;
        });

        if (self.order.cols == 'asc') {
          return aTotal - bTotal;
        } else {
          return bTotal - aTotal;
        }
      });
    }

    // BUILD TABLE
    self.table = [];
    self.table.push([self.cols.label]);

    each(self.series[0].values, function(value){
      self.table.push([value[self.cols.label]]);
    });

    each(self.series, function(series){
      self.table[0].push(series.key);
      each(series.values, function(record, j){
        self.table[j+1].push(record.value);
      });
    });

    // COLUMN TRANSFORMS
    /*
    if (setup.cols.transform) {
      for (var transform in setup.cols.transform) {
        if (transform == 'all') {
          each(self.table[0], function(column, index){
            if (index > 0) {
              self.table[0][index] = setup.cols.transform[transform](self.table[0][index]);
            }
          });
        } else {
          transform = parseInt(transform);
          if (self.table[0].length > transform) {
            self.table[0][transform] = setup.cols.transform[transform](self.table[0][transform]);
          }
        }
      }
    }*/

    // ROW TRANSFORMS
    /*
    if (setup.rows.transform) {
      each(self.table, function(row, index){
        if (index > 0) {
          for (var transform in setup.rows.transform) {
            self.table[index][transform] = setup.rows.transform[transform](self.table[index][transform]);
          }
        }
      });
    }*/

    return this;
  };

  function parse() {
    var result = [];
    var loop = function() {
      var root = arguments[0];
      var args = Array.prototype.slice.call(arguments, 1);
      var target = args.pop();

      if (args.length === 0) {
        if (root instanceof Array) {
          args = root;
        } else if (typeof root === 'object') {
          args.push(root);
        }
      }

      each(args, function(el){

        if (el[target] || el[target] === 0 || el[target] !== void 0) {
          // Easy grab!
          if (el[target] === null) {
            return result.push('');
          } else {
            return result.push(el[target]);
          }

        } else if (root[el]){
          if (root[el] instanceof Array) {
            // dive through each array item

            each(root[el], function(n, i) {
              var splinter = [root[el]].concat(root[el][i]).concat(args.slice(1)).concat(target);
              return loop.apply(this, splinter);
            });

          } else {
            if (root[el][target]) {
              // grab it!
              return result.push(root[el][target]);

            } else {
              // dive down a level!
              return loop.apply(this, [root[el]].concat(args.splice(1)).concat(target));

            }
          }

        } else {
          // dive down a level!
          return loop.apply(this, [el].concat(args.splice(1)).concat(target));

        }

        return;

      });
      if (result.length > 0) {
        return result;
      }
    };
    return loop.apply(this, arguments);
  }

})(chartstack);
