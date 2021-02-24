import { useBox } from "@react-three/cannon";
import React, { useEffect, useRef } from "react";
import { Quaternion } from "three/src/math/Quaternion";
import { Vector3 } from "three/src/math/Vector3";
import { getRandomColor } from "../utils/color";
import useBoxState from "../utils/useBoxState";
import useFrameElapsed from "../utils/useFrameElapsed";

const ControledBox: React.FC = (props) => {
  const color = useRef(getRandomColor());
  const velocity = useRef(new Vector3(0, 0, 0));

  const [ref, api] = useBox(() => ({
    type: "Dynamic",
    fixedRotation: false,
    mass: 10,
    position: [0, 1, 0],
    angularDamping: 1,
    args: [1, 2, 1],
    ...props,
  }));
  const boxState = useBoxState();

  useEffect(() => {
    api.velocity.subscribe((v) => {
      velocity.current = new Vector3(v[0], v[1], v[2]);
    });
  }, []);

  useFrameElapsed((state, delta, timeElpased) => {
    const box = ref.current;
    if (box) {
      let v = velocity.current.clone();
      let r = box.quaternion.clone();
      let p = box.position.clone();
      let br = box.rotation.clone();
      let q = new Quaternion();

      if (boxState.forward) {
        const forward = new Vector3(0, 0, -1 * timeElpased * 10);
        forward.applyQuaternion(box.quaternion);
        p.add(forward);
      }
      if (boxState.backward) {
        const backward = new Vector3(0, 0, 1 * timeElpased * 10);
        backward.applyQuaternion(box.quaternion);
        p.add(backward);
      }
      if (boxState.left) {
        q.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI * timeElpased);
        br.setFromQuaternion(r.multiply(q));
      }
      if (boxState.right) {
        q.setFromAxisAngle(new Vector3(0, -1, 0), Math.PI * timeElpased);
        br.setFromQuaternion(r.multiply(q));
      }
      if (boxState.jump || box.position.y < 0.05) {
        console.log(box.position.y);
        const jump = new Vector3(0, timeElpased * 20, 0);
        jump.applyQuaternion(box.quaternion);
        p.add(jump);
      }
      api.rotation.set(br.x, br.y, br.z);
      api.position.set(p.x, p.y, p.z);
    }
  });

  return (
    <mesh receiveShadow castShadow ref={ref} position={[0, 1, 0]}>
      <boxBufferGeometry attach="geometry" args={[1, 2, 1]} />
      <meshStandardMaterial attach="material" color={color.current} />
    </mesh>
  );
};

export default ControledBox;
