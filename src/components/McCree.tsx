import { useGLTF } from "@react-three/drei";
import React from "react";

const McCree: React.FC = () => {
  const { scene } = useGLTF("/models/gltf/mccree/scene.gltf");

  return <primitive object={scene} />;
};

export default McCree;
