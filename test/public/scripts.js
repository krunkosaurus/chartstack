function url2blob(url, cb){
  var img = document.createElement('img');
  img.setAttribute('src', url);

  img.onload = function(){
    var canvas = document.createElement('canvas');
    var context = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    var byteString = atob(canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, ""));
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    var dataView = new DataView(ab);
    var blob = new Blob([dataView], {type: "image/png"});
    cb(blob);
  }
}
