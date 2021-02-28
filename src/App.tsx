import { Sky } from "@react-three/drei";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Canvas } from "react-three-fiber";
import CameraControls from "./components/CameraControls";
import Plane from "./components/Plane";
import { Physics } from "@react-three/cannon";
import { Vector3 } from "three";
import Box from "./components/Box";
import Player from "./components/Player";
import { KeyContext, useKeyState } from "./utils/services/KeyService";
import { v4 } from "uuid";

function App() {
  const context = useContext(KeyContext);
  const cubes = [];
  const [id] = useState(v4());
  const socketRef = useRef<WebSocket>();
  useKeyState((keys) => {
    socketRef.current?.send(
      JSON.stringify({
        id,
        keys,
      })
    );
  });

  useEffect(() => {
    // Create WebSocket connection.
    const socket = new WebSocket("ws://localhost:8000");

    // Connection opened
    socket.addEventListener("open", function (event) {
      socket.send(JSON.stringify({ message: "Hello server!" }));
    });

    // Listen for messages
    socket.addEventListener("message", function (event) {
      console.log(JSON.parse(event.data));
    });

    socketRef.current = socket;
  }, []);

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
        <KeyContext.Provider value={context}>
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
            gravity={[0, -20, 0]}
            defaultContactMaterial={{
              contactEquationStiffness: 1e10,
              contactEquationRelaxation: 10,
            }}
            iterations={20}
            //allowSleep={true}
            broadphase="Naive"
          >
            {cubes}
            <Plane />
            <Player />
            <Box position={[0, 1, 0]} />
            {/* <Suspense fallback={<Loading />}>
            <Player />
          </Suspense> */}
          </Physics>
        </KeyContext.Provider>
      </Canvas>
    </>
  );
}

export default App;
