import { Cloud, Sky } from "@react-three/drei";
import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import CameraControls from "./components/CameraControls";
import Plane from "./components/Plane";
import Loading from "./components/Loading";
import Player from "./components/Player";
import { Physics } from "@react-three/cannon";
import { Vector3 } from "three";
import Box from "./components/Box";
import Sphere from "./components/Sphere";

function App() {
  const cubes = [];
  for (let i = 0; i < 100; i++) {
    var x =
      Math.ceil(Math.random() * 11) * (Math.round(Math.random()) ? 1 : -1);
    var z =
      Math.ceil(Math.random() * 11) * (Math.round(Math.random()) ? 1 : -1);
    if (i % 2 === 1) {
      cubes.push(<Box position={[x, 10 + i, z]} />);
    } else {
      cubes.push(<Sphere position={[x, 10 + i, z]} />);
    }
  }

  return (
    <>
      <Canvas
        camera={{ position: [0, Math.PI, 5] }}
        shadowMap
        gl={{ alpha: false }}
      >
        {/* <gridHelper args={[100, 10, 0x888888, 0x444444]} /> */}
        <CameraControls />
        <ambientLight intensity={0.3} />
        <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
        <Sky sunPosition={new Vector3(100, 10, 100)} />
        <Physics gravity={[0, -30, 0]}>
          {cubes}
          <Plane />
          <Suspense fallback={<Loading />}>
            <Player />
          </Suspense>
        </Physics>
      </Canvas>
    </>
  );
}

export default App;
