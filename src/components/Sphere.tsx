import { useSphere } from "@react-three/cannon";
import React from "react";
import { getRandomColor } from "../utils/color";

type Props = {
  position: [x: number, y: number, z: number];
};

const Box: React.FC<Props> = (props) => {
  const [ref] = useSphere(() => ({
    ...props,
    mass: 1,
    type: "Dynamic",
  }));

  return (
    <mesh {...props} ref={ref} scale={[1, 1, 1]}>
      <sphereBufferGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={getRandomColor()} />
    </mesh>
  );
};

export default Box;
