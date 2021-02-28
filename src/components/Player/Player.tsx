import { BoxProps } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { useSocket } from "../../utils/services/WebSocketService";
import PlayerAnimation from "../../utils/PlayerAnimation";
import usePlayerControl from "../../utils/usePlayerControl";
import ThirdCamera from "../ThirdCamera";

const Player = (props?: BoxProps) => {
  const [id] = useState(v4());
  const socket = useSocket();
  // const keys = useKeyState((keys) => {
  //   socket.send(
  //     JSON.stringify({
  //       id,
  //       keys,
  //     })
  //   );
  // });

  const [ref] = usePlayerControl(props);

  const { scene, animations } = useGLTF("/models/gltf/Soldier.glb");

  useEffect(() => {
    scene.rotateY(Math.PI);
  }, [scene]);

  return (
    <>
      <ThirdCamera target={ref} />
      <PlayerAnimation scene={scene} animations={animations} />
      <mesh ref={ref} attach="geometry" position={[0, 0, 0]}>
        <primitive object={scene} />
      </mesh>
    </>
  );
};

export default Player;
