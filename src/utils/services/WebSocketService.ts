let webSocket: WebSocket | undefined = undefined;

export const init = () => {
  const webSocket = new WebSocket("ws://localhost:8000");

  // Connection opened
  webSocket.addEventListener("open", function (event) {
    webSocket.send(JSON.stringify({ message: "Hello server!" }));
  });

  // Listen for messages
  webSocket.addEventListener("message", function (event) {
    console.log(JSON.parse(event.data));
  });

  return webSocket;
};

export const getSocket = () => {
  if (!webSocket) {
    throw new Error("WebSocket is not initalized.");
  }
  return webSocket;
};
