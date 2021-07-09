/* global chartstack */

(function(){

  function obj2Array(obj){
    var ar = [];
    chartstack.each(obj, function(val, key){

      if (key == "Date"){
        val = new Date(val);
      }else if (key == "Steps"){
        if (isNaN(val)){
          val = parseInt(val.replace(/,/g,''));
        }
      }

      ar.push(val);
    });
    return ar;
  }

  // Reduce columns to just colName.
  function reduce(colName, ar){
    var index = ar[0].indexOf(colName);

    if (index == -1){
      throw new Error('"' + colName + '" not found in data headers.');
    }

    chartstack.each(ar, function(row){
      var len = row.length;
      while (len--){
        if (len !== 0 && len !== index){
          row.splice(len, 1);
        }
      }

    });
    return ar;
  }

  function adapter(data){

    var ar = [data.headers];

    chartstack.each(data.rows, function(row){
      ar.push(obj2Array(row));
    });

    ar = reduce('Steps', ar);
    return {
      data : ar,
      extras: {}
    };
  }

  chartstack.addAdapter('fitbit', {
    barchart: adapter,
    linechart: adapter
  });

})();
