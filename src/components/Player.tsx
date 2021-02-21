import { useBox } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import React from "react";
import _ from "lodash";
import { AnimationAction, AnimationMixer } from "three";
import { useFrame } from "react-three-fiber";
import useMove from "../utils/useMove";

const Player: React.FC = () => {
  const { scene, animations } = useGLTF("/models/gltf/Soldier.glb");
  const move = useMove();
  const mixer = new AnimationMixer(scene);
  const actions: { [key: string]: AnimationAction } = {
    idle: mixer.clipAction(animations[0]),
    walk: mixer.clipAction(animations[3]),
    run: mixer.clipAction(animations[1]),
  };

  const [mcCree, api] = useBox(() => ({
    mass: 50,
    position: [0, 1, 0],
  }));

  useFrame((state, delta) => {
    const { playerPrevState, playerState } = move.current;
    mixer?.update(delta);
    if (playerState !== playerPrevState) {
      actions[playerState].play();
      actions[playerPrevState].stop();
      move.current.playerPrevState = playerState;
    }
  });

  return (
    <mesh ref={mcCree} attach="geometry">
      <primitive object={scene} />
    </mesh>
  );
};

export default Player;
