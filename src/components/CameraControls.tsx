import { useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three/examples/jsm/controls/OrbitControls";
import { useOrbit } from "../zustand/OrbitStore";

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  const orbitEnabled = useOrbit((state) => state.orbitEnabled);
  const controls = useRef<OrbitControlsImpl>(null);
  useFrame(() => controls.current?.update());

  return (
    <OrbitControls
      ref={controls}
      args={[camera, domElement]}
      enabled={orbitEnabled}
      // enableZoom={false}
      // maxAzimuthAngle={Math.PI / 4}
      // maxPolarAngle={Math.PI}
      // minAzimuthAngle={-Math.PI / 4}
      // minPolarAngle={0}
    />
  );
};

export default CameraControls;
