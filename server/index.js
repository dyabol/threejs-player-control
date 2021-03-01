const express = require("express");
const WebSocket = require("ws");
const uuid = require("uuid");
const app = express();

const port = 8000;

// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new WebSocket.Server({ noServer: true });

wsServer.on("connection", (socket) => {
  socket.id = uuid.v4();
  const playerList = [];
  wsServer.clients.forEach((client) => {
    playerList.push(client.id);
  });
  wsServer.clients.forEach((client) => {
    client.send(JSON.stringify({ type: "PLAYER_LIST", data: playerList }));
  });
  socket.send(
    JSON.stringify({
      type: "PLAYER_ID",
      id: socket.id,
    })
  );
  socket.on("message", (data) => {
    const d = JSON.parse(data);
    const { type, id } = d;
    switch (type) {
      case "KEYS":
        wsServer.clients.forEach((client) => {
          if (client.id !== id) {
            console.log(`from: ${id}`, `to: ${client.id}`);
            client.send(data);
          }
        });
        break;
      default:
        break;
    }
  });

  socket.on("disconnect", function () {
    console.log("disconnect");
  });
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});
