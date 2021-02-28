import React, { useEffect, useRef } from "react";
import { TransformControls } from "@react-three/drei";
import { TransformControls as TransformControlsImpl } from "three/examples/jsm/controls/TransformControls";
import { Object3D } from "three/src/core/Object3D";
import { useOrbit } from "../zustand/OrbitStore";

type Props = {
  children: React.ReactElement<Object3D>;
};

const Transform: React.FC<Props> = ({ children }) => {
  const setOrbitEnabled = useOrbit((state) => state.setOrbitEnabled);
  const transform = useRef<TransformControlsImpl>(null);
  useEffect(() => {
    const control = transform.current;
    const callback = (event: THREE.Event) => setOrbitEnabled(!event.value);
    control?.addEventListener("dragging-changed", callback);

    return () => {
      control?.removeEventListener("dragging-changed", callback);
    };
  }, []);

  return <TransformControls ref={transform}>{children}</TransformControls>;
};

export default Transform;
