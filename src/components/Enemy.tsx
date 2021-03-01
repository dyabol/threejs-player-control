import React from "react";
import { getRandomColor } from "../utils/color";
import usePlayerControl from "./Player/usePlayerControl";

type Props = {
  position: [x: number, y: number, z: number];
  id: string;
};

const Box: React.FC<Props> = ({ position, id }) => {
  const [ref] = usePlayerControl(id, { position });
  return (
    <mesh receiveShadow castShadow position={position} ref={ref}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={getRandomColor()} />
    </mesh>
  );
};

export default Box;
