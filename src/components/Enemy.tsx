import { useBox } from "@react-three/cannon";
import React from "react";
import { useFrame } from "react-three-fiber";
import { getRandomColor } from "../utils/color";
import { useGame } from "../zustand/GameStore";

type Props = {
  position: [x: number, y: number, z: number];
  id: string;
};

const Box: React.FC<Props> = ({ id }) => {
  const [ref] = useBox(() => ({
    mass: 1,
  }));

  useFrame(() => {
    const position = useGame.getState().playerStates[id].position;
    ref.current?.position.set(...position);
  });

  return (
    <mesh receiveShadow castShadow ref={ref}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={getRandomColor()} />
    </mesh>
  );
};

export default Box;
