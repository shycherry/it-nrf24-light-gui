var ITNode = require("IT_NODE").ITNode;

var itNode = new ITNode();
var myport = itNode.port;

var sendPromise = Promise.resolve();

var colorpicker = document.querySelector("#colorpicker");
var sliderRGB = document.querySelector("#sliderRGB");
var sliderCW = document.querySelector("#sliderCW");
var sliderWW = document.querySelector("#sliderWW");

function sendUserData(){
  var rgb = colorpicker.getSelectedRGB();
  var rgbPOW = sliderRGB.immediateValue;
  var cwPOW = sliderCW.immediateValue;
  var wwPOW = sliderWW.immediateValue;

  var rPOW = Math.round((rgbPOW / 255) * rgb.r);
  var gPOW = Math.round((rgbPOW / 255) * rgb.g);
  var bPOW = Math.round((rgbPOW / 255) * rgb.b);

  sendPromise = sendPromise.then(function(){
    return connectSendData(rPOW, gPOW, bPOW, cwPOW, wwPOW);
  });
  return sendPromise;
}

colorpicker.addEventListener("click", sendUserData);
sliderRGB.addEventListener("value-change", sendUserData);
sliderCW.addEventListener("value-change", sendUserData);
sliderWW.addEventListener("value-change", sendUserData);

function connectSendData(r,g,b,cw,ww){

  data = new Buffer(5);
  data.writeUInt8(b,0);
  data.writeUInt8(r,1);
  data.writeUInt8(g,2);
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

