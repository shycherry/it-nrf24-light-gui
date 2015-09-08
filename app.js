var ITNode = require("IT_NODE").ITNode;

var itNode = new ITNode();
var myport = itNode.port;

var sendPromise = Promise.resolve();
var colorpicker = document.querySelector("#colorpicker");
colorpicker.addEventListener("click", function(){
  var rgb = colorpicker.getSelectedRGB();
  sendPromise = sendPromise.then(function(){
    return connectSendData(rgb.r, rgb.g, rgb.b, 255, 255);
  });
  return sendPromise;
});

function connectSendData(r,g,b,cw,ww){

  data = new Buffer(5);
  data.writeUInt8(b,0);
  data.writeUInt8(g,1);
  data.writeUInt8(r,2);
  data.writeUInt8(ww,3);
  data.writeUInt8(cw,4);

  return itNode.getManager()
  .then(function(manager){
    return manager.getUuidsDeepTaggedBy("sendData")
    .then(function(uuids){
        var args = {
          "it_service" : uuids[0],
          "params" : {
            "ip" : "F0F0F0F0E1",
            "data" : data
          }
        };

        return itNode.callService( args )
        .then(function(link){
          console.log("log client side : "+link["link_response"]);
        })
        .catch(function(err){
          console.error(err);
        });
    });
  });

}

