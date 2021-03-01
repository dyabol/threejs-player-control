import { useBox } from "@react-three/cannon";
import React, { useMemo } from "react";
import { getRandomColor } from "../utils/color";

type Props = {
  position: [x: number, y: number, z: number];
};

const Box: React.FC<Props> = (props) => {
  const color = useMemo(() => getRandomColor(), []);
  const [ref] = useBox(() => ({
    ...props,
    mass: 1,
    type: "Dynamic",
    args: [1, 1, 1],
  }));

  return (
    <mesh receiveShadow castShadow {...props} ref={ref}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Box;
