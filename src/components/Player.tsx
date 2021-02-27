import { BoxProps } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import React, { useEffect } from "react";
import { useFrame } from "react-three-fiber";
import { Euler, Vector3 } from "three";
import usePlayerAnimation from "../utils/usePlayerAnimation";
import usePlayerControl from "../utils/usePlayerControl";
import ThirdCamera from "./ThirdCamera";

const Player = (props?: BoxProps) => {
  const [ref] = usePlayerControl(props);
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
