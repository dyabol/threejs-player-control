import { Api, BoxProps, useBox } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { Quaternion, Vector3 } from "three";
import { getKeys } from "../../utils/services/Keyboard";
import useFrameElapsed from "../../utils/useFrameElapsed";

const usePlayerControl = (props?: BoxProps): Api => {
  const decceleration = useRef(new Vector3(-0.0005, -0.0001, -5.0));
  const acceleration = useRef(new Vector3(1, 0.125, 50.0));
  const velocity = useRef(new Vector3(0, 0, 0));

  const [ref, api] = useBox(() => ({
    type: "Dynamic",
    fixedRotation: false,
    mass: 80,
    //position: [0, 0, 0],
    angularDamping: 1,
    //args: [1, 1, 1],
    ...props,
  }));

  useEffect(() => {
    api.velocity.subscribe((v) => {
      velocity.current = new Vector3(v[0], v[1], v[2]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrameElapsed((state, delta, timeElpased) => {
    const player = ref.current;
    const keyState = getKeys();
    if (player && keyState) {
      const dec = decceleration.current.clone();
      const acc = acceleration.current.clone();
      let v = velocity.current.clone();
      let r = player.quaternion.clone();
      let p = player.position.clone();
      let br = player.rotation.clone();
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

      acc.multiplyScalar(3.0);
      if (keyState.shift) {
        acc.multiplyScalar(2.0);
      }

      if (keyState.forward) {
        v.z += acc.z * timeElpased;
      }
      if (keyState.backward) {
        v.z -= acc.z * timeElpased;
      }

      if (keyState.space && p.y <= 1) {
        api.velocity.set(0, 7, 0);
        // const jump = new Vector3(0, 1, 0);
        // jump.applyQuaternion(player.quaternion);
        // //jump.multiplyScalar(v.y * timeElpased * 10);
        // p.add(jump);
      }

      const forward = new Vector3(0, 0, 1);
      forward.applyQuaternion(player.quaternion);
      forward.normalize();
      forward.multiplyScalar(v.z * timeElpased);
      p.add(forward);

      const sideways = new Vector3(1, 0, 0);
      sideways.applyQuaternion(player.quaternion);
      sideways.normalize();
      sideways.multiplyScalar(v.x * timeElpased);
      p.add(sideways);

      if (keyState.left) {
        q.setFromAxisAngle(
          new Vector3(0, 1, 0),
          4.0 * Math.PI * timeElpased * acceleration.current.y
        );
        br.setFromQuaternion(r.multiply(q));
      }
      if (keyState.right) {
        q.setFromAxisAngle(
          new Vector3(0, -1, 0),
          4.0 * Math.PI * timeElpased * acceleration.current.y
        );
        br.setFromQuaternion(r.multiply(q));
      }
      api.rotation.set(br.x, br.y, br.z);
      api.position.set(p.x, p.y, p.z);
    }
  });

  return [ref, api];
};

export default usePlayerControl;
