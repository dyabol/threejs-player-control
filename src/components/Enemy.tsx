import React, { useEffect, useRef } from "react";
import { getRandomColor } from "../utils/color";
import { InitValue, Keys } from "../utils/services/KeyService";
import { useSocket } from "../utils/services/WebSocketService";
import usePlayerControl from "../utils/usePlayerControl";

type Props = {
  position: [x: number, y: number, z: number];
};

const Box: React.FC<Props> = (props) => {
  const socket = useSocket();
  const keys = useRef<Keys>(InitValue);
  const [ref] = usePlayerControl(keys, props);

  const onMessage = (event: MessageEvent) => {
    keys.current = JSON.parse(event.data).keys;
  };

  useEffect(() => {
    socket.addEventListener("message", onMessage);
    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <mesh receiveShadow castShadow {...props} ref={ref}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={getRandomColor()} />
    </mesh>
  );
};

export default Box;
