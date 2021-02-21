import { useSphere } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import { AnimationAction, AnimationMixer, Quaternion, Vector3 } from "three";
import useMove from "../utils/useMove";
import useFrameElapsed from "../utils/useFrameElapsed";
import ThirdCamera from "./ThirdCamera";

const Player: React.FC = (props) => {
  const decceleration = useRef(new Vector3(-0.0005, -0.0001, -5.0));
  const acceleration = useRef(new Vector3(1, 0.125, 50.0));
  const velocity = useRef(new Vector3(0, 0, 0));
  const { scene, animations } = useGLTF("/models/gltf/Soldier.glb");
  const mixer = new AnimationMixer(scene);
  const actions: { [key: string]: AnimationAction } = {
    idle: mixer.clipAction(animations[0]),
    walk: mixer.clipAction(animations[3]),
    run: mixer.clipAction(animations[1]),
  };
  const move = useMove({ actions });

  useEffect(() => {
    scene.rotateY(Math.PI);
    api.velocity.subscribe(
      (v) => (velocity.current = new Vector3(v[0], v[1], v[2]))
    );
  }, []);

  const [player, api] = useSphere(() => ({
    type: "Static",
    mass: 70,
    position: [0, 0, 0],
    ...props,
  }));

  useFrameElapsed(({ clock }, delta, timeInSeconds) => {
    mixer?.update(delta);
    const controlObject = player.current;
    if (controlObject) {
      const _velocity = velocity.current.clone();
      const _decceleration = decceleration.current;
      const _Q = new Quaternion();
      const _A = new Vector3();
      const _R = controlObject.quaternion.clone();

      const frameDecceleration = new Vector3(
        _velocity.x * _decceleration.x,
        _velocity.y * _decceleration.y,
        _velocity.z * _decceleration.z
      );
      frameDecceleration.multiplyScalar(timeInSeconds);
      frameDecceleration.z =
        Math.sign(frameDecceleration.z) *
        Math.min(Math.abs(frameDecceleration.z), Math.abs(_velocity.z));

      _velocity.add(frameDecceleration);

      const acc = acceleration.current.clone();
      if (move.current.shift) {
        acc.multiplyScalar(4.0);
      } else {
        acc.multiplyScalar(2.0);
      }

      if (move.current.up) {
        _velocity.z += acc.z * timeInSeconds;
      }
      if (move.current.down) {
        _velocity.z -= acc.z * timeInSeconds;
      }

      if (move.current.left) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(
          _A,
          4.0 * Math.PI * timeInSeconds * acceleration.current.y
        );
        _R.multiply(_Q);
      }
      if (move.current.right) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(
          _A,
          4.0 * -Math.PI * timeInSeconds * acceleration.current.y
        );
        _R.multiply(_Q);
      }

      const rotation = controlObject.rotation.clone();
      rotation.setFromQuaternion(_R);
      api.rotation.set(rotation.x, rotation.y, rotation.z);

      const forward = new Vector3(0, 0, 1);
      forward.applyQuaternion(controlObject.quaternion);
      forward.normalize();

      const sideways = new Vector3(1, 0, 0);
      sideways.applyQuaternion(controlObject.quaternion);
      sideways.normalize();

      sideways.multiplyScalar(_velocity.x * timeInSeconds);
      forward.multiplyScalar(_velocity.z * timeInSeconds);

      const pos = controlObject.position.clone();
      pos.add(forward);
      pos.add(sideways);
      api.position.set.apply(this, pos.toArray());

      if (
        move.current.space &&
        Math.abs(Number(velocity.current.y.toFixed(2))) < 0.05
      ) {
        api.velocity.set(velocity.current.x, 10, velocity.current.z);
      }
    }
  });

  return (
    <>
      <ThirdCamera target={player} />
      <mesh ref={player} attach="geometry">
        <primitive object={scene} />
      </mesh>
    </>
  );
};

export default Player;
