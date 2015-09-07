var ITNode = require("IT_NODE").ITNode;

var itNode = new ITNode();
var myport = itNode.port;

function youdoHandler(data, itSocket){
  console.log("log server side : " + data);
  itSocket.on("mousemove", function(x,y){
    console.log("received mouse "+x+" "+y);
  });
  return "echo "+data;
};

itNode.addService({
  name : "echo",
  handler : youdoHandler
});

function connectEcho(){

  return itNode.getManager()
  .then(function(manager){
    return manager.getUuidsDeepTaggedBy("echo")
    .then(function(uuids){
        var args = {
          "it_service" : uuids[0],
          "params" : "yo !"
        };

        return itNode.callService( args )
        .then(function(link){
          console.log("log client side : "+link["link_response"]);
          window.addEventListener("mousemove", function(ev){
            link["link_socket"].emit("mousemove",ev.x, ev.y);
          });
        })
        .catch(function(err){
          console.error(err);
        });

    });
  });

}

function connectSendData(){

  return itNode.getManager()
  .then(function(manager){
    return manager.getUuidsDeepTaggedBy("sendData")
    .then(function(uuids){
        var args = {
          "it_service" : uuids[0],
          "params" : {
            "ip" : "F0F0F0F0D2",
            "data" : "ddddd"
          }
        };

        return itNode.callService( args )
        .then(function(link){
          console.log("log client side : "+link["link_response"]);
          window.addEventListener("mousemove", function(ev){
            link["link_socket"].emit("mousemove",ev.x, ev.y);
          });
        })
        .catch(function(err){
          console.error(err);
        });
    });
  });

}

