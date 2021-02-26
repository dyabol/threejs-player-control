import { BoxProps } from "@react-three/cannon";
import React, { useMemo } from "react";
import { getRandomColor } from "../utils/color";
import usePlayerControl from "../utils/usePlayerControl";
import ThirdCamera from "./ThirdCamera";

const ControledBox = (props?: BoxProps) => {
  const color = useMemo(getRandomColor, []);
  const [ref] = usePlayerControl(props);
  return (
    <>
      <ThirdCamera target={ref} />
      <mesh receiveShadow castShadow ref={ref} position={[0, 1, 0]}>
        <boxBufferGeometry attach="geometry" args={[1, 2, 1]} />
        <meshStandardMaterial attach="material" color={color} />
      </mesh>
    </>
  );
};

export default ControledBox;
