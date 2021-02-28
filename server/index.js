const express = require("express");
const WebSocket = require("ws");
const app = express();

const port = 8000;

// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new WebSocket.Server({ noServer: true });

wsServer.on('connection', (socket) => {
  socket.on('message', (data) => {
    wsServer.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
            client.send(data);
      }
    });
  });
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});
