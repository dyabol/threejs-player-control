import { useGLTF } from "@react-three/drei";
import React from "react";
import * as THREE from "three";

const Planet: React.FC = (props) => {
  const { nodes, materials } = useGLTF("/models/gltf/planet.gltf", true);
  console.log(nodes);
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group
          position={[0, 0.02, -6.33]}
          rotation={[0.24, -0.55, 0.56]}
          scale={[7, 7, 7]}
        >
          <mesh
            material={materials.scene}
            geometry={(nodes.planet001_1 as THREE.Mesh).geometry}
          />
          <mesh
            material={materials.scene}
            geometry={(nodes.planet001_2 as THREE.Mesh).geometry}
          />
        </group>
      </group>
    </group>
  );
};

export default Planet;

useGLTF.preload("/models/gltf/planet.gltf", true);
