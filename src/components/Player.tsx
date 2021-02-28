import { BoxProps } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import { useGraph } from "react-three-fiber";
import { v4 } from "uuid";
import { useKeyState } from "../utils/services/KeyService";
import { useSocket } from "../utils/services/WebSocketService";
import usePlayerAnimation from "../utils/usePlayerAnimation";
import usePlayerControl from "../utils/usePlayerControl";
import ThirdCamera from "./ThirdCamera";

const Player = (props?: BoxProps) => {
  const [id] = useState(v4());
  const socket = useSocket();
  const keys = useKeyState((keys) => {
    socket.send(
      JSON.stringify({
        id,
        keys,
      })
    );
  });
  const [ref] = usePlayerControl(keys, props);

  const { scene, animations } = useGLTF("/models/gltf/Soldier.glb");

  usePlayerAnimation(scene, animations);

  useEffect(() => {
    scene.rotateY(Math.PI);
  }, [scene]);

  return (
    <>
      <ThirdCamera target={ref} />
      <mesh ref={ref} attach="geometry" position={[0, 0, 0]}>
        <primitive object={scene} />
      </mesh>
    </>
  );
};

export default Player;
