import { useRef } from "react";
import { useThree } from "react-three-fiber";
import { Object3D, Vector3 } from "three";
import useFrameElapsed from "../utils/useFrameElapsed";

type Props = {
  target: React.MutableRefObject<Object3D | undefined | null>;
};

const ThirdCamera: React.FC<Props> = ({ target }) => {
  const { camera } = useThree();
  const currentPosition = useRef(new Vector3());
  const currentLookat = useRef(new Vector3());

  const calculateIdealOffset = (target: Object3D) => {
    const idealOffset = new Vector3(0, 4, -5);
    idealOffset.applyQuaternion(target.quaternion);
    idealOffset.add(target.position);
    return idealOffset;
  };

  const calculateIdealLookat = (target: Object3D) => {
    const idealLookat = new Vector3(0, 1, 5);
    idealLookat.applyQuaternion(target.quaternion);
    idealLookat.add(target.position);
    return idealLookat;
  };

  useFrameElapsed((state, delta, timeElapsed) => {
    if (target.current) {
      const idealOffset = calculateIdealOffset(target.current);
      const idealLookat = calculateIdealLookat(target.current);

      // const t = 0.05;
      // const t = 4.0 * timeElapsed;
      const t = 1.0 - Math.pow(0.01, timeElapsed);

      currentPosition.current.lerp(idealOffset, t);
      currentLookat.current.lerp(idealLookat, t);

      camera.position.copy(currentPosition.current);
      camera.lookAt(currentLookat.current);
    }
  });

  return null;
};

export default ThirdCamera;
