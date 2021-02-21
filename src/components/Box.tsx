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
  }));

  return (
    <mesh {...props} ref={ref} scale={[1, 1, 1]}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={getRandomColor()} />
    </mesh>
  );
};

export default Box;
