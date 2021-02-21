import { usePlane } from "@react-three/cannon";

const Plane = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    mass: 0,
  }));
  return (
    <mesh ref={ref} attach="geometry">
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color="#88ff70" />
    </mesh>
  );
};

export default Plane;
