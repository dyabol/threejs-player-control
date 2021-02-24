import { useBox } from "@react-three/cannon";
import React from "react";
import { getRandomColor } from "../utils/color";

type Props = {
  position: [x: number, y: number, z: number];
};

const Box: React.FC<Props> = (props) => {
  const [ref] = useBox(() => ({
    ...props,
    mass: 1,
    type: "Dynamic",
    args: [1, 1, 1],
  }));

  return (
    <mesh receiveShadow castShadow {...props} ref={ref}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={getRandomColor()} />
    </mesh>
  );
};

export default Box;
