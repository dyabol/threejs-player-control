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

  const walk = () => {
    const { playerPrevState } = move.current;
    const curAction = actions.walk;
    if (playerPrevState) {
      const prevAction = actions[playerPrevState];
      curAction.enabled = true;

      if (playerPrevState === "run") {
        const ratio =
          curAction.getClip().duration / prevAction.getClip().duration;
        curAction.time = prevAction.time * ratio;
      } else {
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
      }
      curAction.crossFadeFrom(prevAction, 0.1, true);
      curAction.play();
    } else {
      curAction.play();
    }
  };

  const idle = () => {
    const { playerPrevState } = move.current;
    const idleAction = actions.idle;
    if (playerPrevState) {
      const prevAction = actions[playerPrevState];
      idleAction.time = 0.0;
      idleAction.enabled = true;
      idleAction.setEffectiveTimeScale(1.0);
      idleAction.setEffectiveWeight(1.0);
      idleAction.crossFadeFrom(prevAction, 0.25, true);
      idleAction.play();
    } else {
      idleAction.play();
    }
  };

  const run = () => {
    const { playerPrevState } = move.current;
    const curAction = actions.run;
    if (playerPrevState) {
      const prevAction = actions[playerPrevState];

      curAction.enabled = true;

      if (playerPrevState === "walk") {
        const ratio =
          curAction.getClip().duration / prevAction.getClip().duration;
        curAction.time = prevAction.time * ratio;
      } else {
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
      }

      curAction.crossFadeFrom(prevAction, 0.1, true);
      curAction.play();
    } else {
      curAction.play();
    }
  };

  useFrame((state, delta) => {
    const { playerPrevState, playerState } = move.current;
    mixer?.update(delta);
    if (playerState !== playerPrevState) {
      switch (playerState) {
        case "walk":
          walk();
          break;
        case "idle":
          idle();
          break;
        case "run":
          run();
          break;
        default:
          break;
      }
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
