import { useBox } from "@react-three/cannon";
import React, { useRef, useState } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";

type Props = {
  position: [x: number, y: number, z: number];
};

const Box: React.FC<Props> = (props) => {
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const [ref] = useBox(() => ({
    ...props,
    mass: 1,
    type: "Dynamic",
  }));

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => {
  //   if (mesh.current) {
  //     mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  //   }
  // });

  return (
    <mesh
      {...props}
      ref={ref}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};

export default Box;
