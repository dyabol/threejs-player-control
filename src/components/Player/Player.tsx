import { BoxProps } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import React, { useEffect } from "react";
import PlayerAnimation from "./PlayerAnimation";
import usePlayerControl from "./usePlayerControl";
import ThirdCamera from "../ThirdCamera";
import { sendKeys } from "../../utils/services/WebSocket";
import { subscribe, Keys } from "../../utils/services/Keyboard";
import { getPlayerId } from "../../utils/services/Game";

const Player = (props?: BoxProps) => {
  const [ref] = usePlayerControl(getPlayerId(), props);
  const { scene, animations } = useGLTF("/models/gltf/Soldier.glb");

  useEffect(
    () =>
      subscribe((keys: Keys) => {
        sendKeys(keys);
      }),
    []
  );

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
