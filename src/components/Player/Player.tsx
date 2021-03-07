import { BoxProps, useBox } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import PlayerAnimation from "./PlayerAnimation";
import ThirdCamera from "../ThirdCamera";
import { useGame } from "../../zustand/GameStore";
import calcPosition from "../../utils/position";
import useFrameElapsed from "../../utils/useFrameElapsed";
import { getKeys } from "../../utils/services/Keyboard";
import {
  getPlayerPosition,
  getPlayerQuaternion,
  getPlayerVelocity,
  setPlayerPosition,
  setPlayerVelocity,
} from "../../utils/services/Game";
import { Vector3 } from "three";

const Player = (props?: BoxProps) => {
  const { scene, animations } = useGLTF("/models/gltf/Soldier.glb");
  const direction = useRef(new Vector3());
  const velocity = useRef(new Vector3());
  const [ref, api] = useBox(() => ({
    type: "Dynamic",
    fixedRotation: false,
    mass: 80,
    //position: [0, 0, 0],
    angularDamping: 1,
    //args: [1, 1, 1],
    ...props,
  }));

  useEffect(() => {
    scene.rotateY(Math.PI);
  }, [scene]);

  // useEffect(() => {
  //   api.velocity.subscribe((v) => {
  //     setPlayerVelocity(v as [number, number, number]);
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useFrameElapsed((state, delta, timeDelta) => {
    const gameState = useGame.getState();
    const id = gameState.clientId;
    if (id) {
      const brakingPower = 10;
      const acceleration = 40;
      // const position = getPlayerPosition();
      // const velocity = getPlayerVelocity();
      // const quaternion = getPlayerQuaternion();
      const keys = getKeys();
      // const newPosition = calcPosition(
      //   timeDelta,
      //   keys,
      //   position,
      //   velocity,
      //   quaternion
      // );
      // api.position.set(...newPosition);
      // setPlayerPosition(newPosition);
      velocity.current.x -= velocity.current.x * brakingPower * delta;
      velocity.current.z -= velocity.current.z * brakingPower * delta;
      direction.current.z = Number(keys.forward) - Number(keys.backward);
      direction.current.x = Number(keys.left) - Number(keys.right);
      direction.current.normalize();
      if (keys.forward || keys.backward) {
        velocity.current.z += direction.current.z * acceleration * delta;
      }

      if (keys.left || keys.right) {
        velocity.current.x += direction.current.x * acceleration * delta;
      }
      api.velocity.copy(velocity.current);
    }
  });

  return (
    <>
      <ThirdCamera target={ref} />
      <PlayerAnimation scene={scene} animations={animations} />
      <mesh ref={ref} attach="geometry">
        <primitive object={scene} />
      </mesh>
    </>
  );
};

export default Player;
