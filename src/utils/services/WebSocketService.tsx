import { createContext, useContext, useMemo } from "react";

const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider: React.FC = (props) => {
  const socket = useMemo(() => {
    const socket = new WebSocket("ws://localhost:8000");

    // Connection opened
    socket.addEventListener("open", function (event) {
      socket.send(JSON.stringify({ message: "Hello server!" }));
    });

    // Listen for messages
    socket.addEventListener("message", function (event) {
      console.log(JSON.parse(event.data));
    });

    return socket;
  }, []);

  return <WebSocketContext.Provider {...props} value={socket} />;
};

export const useSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("bbbb");
  }
  return context;
};
