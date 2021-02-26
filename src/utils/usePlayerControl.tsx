import { Api, BoxProps, useBox } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { Quaternion, Vector3 } from "three";
import useKeyState from "./useKeyState";
import useFrameElapsed from "./useFrameElapsed";

const usePlayerControl = (props?: BoxProps): Api => {
  const decceleration = useRef(new Vector3(-0.0005, -0.0001, -5.0));
  const acceleration = useRef(new Vector3(1, 0.125, 50.0));
  const velocity = useRef(new Vector3(0, 0, 0));
  const keyState = useKeyState();

  const [ref, api] = useBox(() => ({
    type: "Dynamic",
    fixedRotation: false,
    mass: 80,
    position: [0, 1, 0],
    angularDamping: 1,
    args: [1, 2, 1],
    ...props,
  }));

  useEffect(() => {
    api.velocity.subscribe((v) => {
      velocity.current = new Vector3(v[0], v[1], v[2]);
    });
  }, []);

  useFrameElapsed((state, delta, timeElpased) => {
    const box = ref.current;
    if (box) {
      const dec = decceleration.current;
      const acc = acceleration.current;
      let v = velocity.current.clone();
      let r = box.quaternion.clone();
      let p = box.position.clone();
      let br = box.rotation.clone();
      let q = new Quaternion();

      const frameDecceleration = new Vector3(
        v.x * dec.x,
        v.y * dec.y,
        v.z * dec.z
      );
      frameDecceleration.multiplyScalar(timeElpased);
      frameDecceleration.z =
        Math.sign(frameDecceleration.z) *
        Math.min(Math.abs(frameDecceleration.z), Math.abs(v.z));

      v.add(frameDecceleration);

      if (keyState.run) {
        acc.multiplyScalar(4.0);
      }

      if (keyState.forward) {
        v.z += acc.z * timeElpased;
        const forward = new Vector3(0, 0, 1 * timeElpased * 10);
        forward.applyQuaternion(box.quaternion);
        p.add(forward);
      }
      if (keyState.backward) {
        v.z -= acc.z * timeElpased;
        const backward = new Vector3(0, 0, -1 * timeElpased * 10);
        backward.applyQuaternion(box.quaternion);
        p.add(backward);
      }
      if (keyState.left) {
        q.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI * timeElpased);
        br.setFromQuaternion(r.multiply(q));
      }
      if (keyState.right) {
        q.setFromAxisAngle(new Vector3(0, -1, 0), Math.PI * timeElpased);
        br.setFromQuaternion(r.multiply(q));
      }
      if (keyState.jump && box.position.y <= 1) {
        const jump = new Vector3(0, 5, 0);
        jump.applyQuaternion(box.quaternion);
        p.add(jump);
      }
      api.rotation.set(br.x, br.y, br.z);
      api.position.set(p.x, p.y, p.z);
    }
  });

  return [ref, api];
};

export default usePlayerControl;
