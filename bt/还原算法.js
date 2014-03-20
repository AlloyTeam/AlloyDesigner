/**
 * 在console里运行
 * id是图片的id
 */
function back(id){
    var node = document.getElementById(id);
    var WIDTH = node.width;
    var height = node.height;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    canvas.width = WIDTH;
    canvas.height = height;

    ctx.drawImage(node, 0, 0);
    var imgData = ctx.getImageData(0, 0, WIDTH, height);
    var buffer = [];

    var newData = [];
    for(var i = 0; i < imgData.data.length; i += 4){
       newData.push(imgData.data[i]);
       newData.push(imgData.data[i + 1]);
       newData.push(imgData.data[i + 2]);
    }

    for(var i = 0; i < newData.length; i += 8){
      var bufferA = Array.prototype.slice.call(newData, i, i + 8);
      for(var j = 0; j < bufferA.length; j ++){
        bufferA[j] = bufferA[j] > 127.5 ? 1 : 0;
      }
      
      bufferA = bufferA.join("");
      var code = parseInt(bufferA, 2);
      buffer[i / 8] = String.fromCharCode(code);
    }

    var b64 = "data:image/jpeg;base64," + (btoa(buffer.join("").split('AlloyImage')[0]));

    var img3 = new Image();
    document.body.appendChild(img3);

    img3.src = b64;
};
