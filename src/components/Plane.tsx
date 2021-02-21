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
        <planeBufferGeometry args={[15, 15]} />
        <meshBasicMaterial color="#ffb385" />
      </mesh>
      <mesh receiveShadow>
        <planeBufferGeometry args={[15, 15]} />
        <shadowMaterial color="lightsalmon" />
      </mesh>
    </group>
  );
};

export default Plane;
