navigator.webkitGetUserMedia(
  { video: true, audio: true },
  function (stream) {
    
    var Peer = require("simple-peer");
    var peer = new Peer({
      initiator: location.hash == "#init",
      trickle: false,
      stream: stream,
    });

    peer.on("signal", function (data) {
      console.log(data);
      document.getElementById("myId").value = JSON.stringify(data);
      socket.emit('passWEBRTC', {data});
    });

    // document.getElementById("connect").addEventListener("click", function () {
    //   var otherId = JSON.parse(document.getElementById("otherId").value);
    //   console.log(otherId);
    //   peer.signal(otherId);
    // });

    document.getElementById("post").addEventListener("click", function () {
      var message = document.getElementById("message").value;
      peer.send(message);
    });

    socket.on("reciveWEBRTC",function(data){
      console.log(JSON.stringify(data.data))
      document.getElementById("otherId").value = JSON.stringify(data.data)
      peer.signal(JSON.stringify(data.data));
    })

    peer.on("data", function (data) {
      document.getElementById("messages").textContent += data + "\n";
    });

    peer.on("stream", function (stream) {
      console.log("Streaming");
      let myVidePlayer = document.createElement("video");
      document.body.appendChild(myVidePlayer);
      var mediaStream = new MediaStream(stream);
      myVidePlayer.srcObject = mediaStream;
      myVidePlayer.play();
    });
  },
  function (err) {
    console.log(err);
  }
);
