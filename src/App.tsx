import { Sky } from "@react-three/drei";
import React from "react";
import { Canvas } from "react-three-fiber";
import CameraControls from "./components/CameraControls";
import Plane from "./components/Plane";
import { Physics } from "@react-three/cannon";
import { Vector3 } from "three";
import Box from "./components/Box";
import Player from "./components/Player";

function App() {
  const cubes = [];

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < i; j++) {
      cubes.push(
        <Box key={`1-${i}-${j}`} position={[j + 0.5, -0.5 + 5 - i, -3]} />
      );
    }
    for (let j = 0; j < i; j++) {
      cubes.push(
        <Box key={`2-${i}-${j}`} position={[-j - 0.5, -0.5 + 5 - i, -3]} />
      );
    }
  }

  return (
    <>
      <Canvas
        camera={{ position: [0, Math.PI, 5] }}
        shadowMap
        colorManagement
        gl={{ alpha: false }}
      >
        <gridHelper args={[100, 10, 0x888888, 0x444444]} />
        <CameraControls />
        <hemisphereLight intensity={0.35} />
        <spotLight
          position={[100, 50, 100]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          castShadow
          shadow-mapSize-width={256}
          shadow-mapSize-height={256}
        />

        <Sky sunPosition={new Vector3(100, 50, 100)} />
        <Physics
          gravity={[0, -30, 0]}
          defaultContactMaterial={{
            contactEquationStiffness: 1e6,
          }}
        >
          {cubes}
          <Plane />
          <Player />
          {/* <Suspense fallback={<Loading />}>
            <Player />
          </Suspense> */}
        </Physics>
      </Canvas>
    </>
  );
}

export default App;
