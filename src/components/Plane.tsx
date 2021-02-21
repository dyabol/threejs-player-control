import { usePlane } from "@react-three/cannon";

const Plane = () => {
  const [ref] = usePlane(() => ({
    type: "Static",
    material: "ground",
    rotation: [-Math.PI / 2, 0, 0],
  }));
  return (
    <group ref={ref}>
      <mesh>
        <planeBufferGeometry args={[150, 150]} />
        <meshBasicMaterial color="#a8a373" />
      </mesh>
      <mesh receiveShadow>
        <planeBufferGeometry args={[150, 150]} />
        <shadowMaterial color="lightsalmon" />
      </mesh>
    </group>
  );
};

export default Plane;
