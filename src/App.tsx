import { Stars } from "@react-three/drei";
import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import CameraControls from "./components/CameraControls";
import Plane from "./components/Plane";
import Loading from "./components/Loading";
import Player from "./components/Player";
import { Physics } from "@react-three/cannon";

function App() {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 5] }}>
        {/* <gridHelper args={[100, 10, 0x888888, 0x444444]} /> */}
        <ambientLight />
        <CameraControls />
        <Stars />
        <Physics>
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
