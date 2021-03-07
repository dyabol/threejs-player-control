import { useGame } from "../../zustand/GameStore";

let webSocket: WebSocket | undefined = undefined;

enum Types {
  Keys = "KEYS",
  NewPlayer = "NEW_PLAYER",
  PlayerId = "PLAYER_ID",
  PlayerList = "PLAYER_LIST",
}

type PlayerProtocol = {
  type: Types;
  id: string;
  data?: any;
};

export const init = () => {
  const ws = new WebSocket("ws://localhost:8000");

  // Connection opened
  ws.addEventListener("open", function (event) {
    ws.send(JSON.stringify({ type: Types.NewPlayer }));
  });

  // Listen for messages
  ws.addEventListener("message", function (event) {
    const response = JSON.parse(event.data) as PlayerProtocol;
    const { type, id, data } = response;
    switch (type) {
      case Types.PlayerId:
        if (id) {
          useGame.getState().setClientId(id);
        }
        break;
    }
    console.log(response);
  });

  webSocket = ws;
  return ws;
};

export const getSocket = () => {
  if (!webSocket) {
    throw new Error("WebSocket is not initalized.");
  }
  return webSocket;
};

export const sendMessage = (data: PlayerProtocol) => {
  getSocket().send(JSON.stringify(data));
};
