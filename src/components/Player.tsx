import { useSphere } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import { AnimationAction, AnimationMixer, Quaternion, Vector3 } from "three";
import { useFrame } from "react-three-fiber";
import useMove from "../utils/useMove";
import { split } from "lodash";

const Player: React.FC = (props) => {
  const prevElapsedTime = useRef<number>();
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
    api.velocity.subscribe(
      (v) => (velocity.current = new Vector3(v[0], v[1], v[2]))
    );
  }, []);

  const [player, api] = useSphere(() => ({
    type: "Dynamic",
    mass: 1,
    position: [0, 10, 0],
    ...props,
  }));

  useFrame(({ clock }, delta) => {
    mixer?.update(delta);
    const controlObject = player.current;
    if (controlObject) {
      const elapsedTime = clock.getElapsedTime();
      if (prevElapsedTime.current == null) {
        prevElapsedTime.current = elapsedTime;
      }
      const timeInSeconds = clock.getElapsedTime() - prevElapsedTime.current;

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
        acc.multiplyScalar(2.0);
      }

      if (move.current.down) {
        _velocity.z += acc.z * timeInSeconds;
      }
      if (move.current.up) {
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
      prevElapsedTime.current = elapsedTime;
    }
  });

  return (
    <mesh ref={player} attach="geometry">
      <primitive object={scene} />
    </mesh>
  );
};

export default Player;
