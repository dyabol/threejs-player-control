import { Quaternion, Vector3 } from "three";
import { Keys } from "../zustand/KeyboardStore";

const speed = 50;

const calcPosition = (
  delteTime: number,
  keys: Keys,
  position: [number, number, number],
  velocity: [number, number, number],
  quaternion: [number, number, number, number]
): [number, number, number] => {
  console.log(velocity);
  const newPosition = new Vector3(...position);
  const newVelocity = new Vector3(...velocity);
  const newQuaternion = new Quaternion(...quaternion);
  //console.log("velocity", velocity);

  if (keys.forward) {
    newVelocity.z += delteTime * speed;
  }
  if (keys.backward) {
    newVelocity.z -= delteTime * speed;
  }

  const forward = new Vector3(0, 0, 1);
  forward.applyQuaternion(newQuaternion);
  forward.normalize();
  forward.multiplyScalar(newVelocity.z * delteTime);

  newPosition.add(forward);
  return newPosition.toArray();
};

export default calcPosition;
