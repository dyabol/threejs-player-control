import { Stars } from "@react-three/drei";
import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import CameraControls from "./components/CameraControls";
import Ground from "./components/Ground";
import Loading from "./components/Loading";
import McCree from "./components/McCree";

function App() {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 5] }}>
        {/* <gridHelper args={[100, 10, 0x888888, 0x444444]} /> */}
        <ambientLight />
        <CameraControls />
        <Stars />
        <Ground />
        <Suspense fallback={<Loading />}>
          <McCree />
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
