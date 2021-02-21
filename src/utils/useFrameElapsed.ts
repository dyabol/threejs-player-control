import { useRef } from "react";
import { CanvasContext, useFrame } from "react-three-fiber";

const useFrameElapsed = (
  callback: (state: CanvasContext, delta: number, timeElapsed: number) => void
) => {
  const prevElapsedTime = useRef<number>();

  useFrame((state, delta) => {
    const { clock } = state;
    const elapsedTime = clock.getElapsedTime();
    if (prevElapsedTime.current == null) {
      prevElapsedTime.current = elapsedTime;
    }
    const timeInSeconds = clock.getElapsedTime() - prevElapsedTime.current;
    callback(state, delta, timeInSeconds);
    prevElapsedTime.current = elapsedTime;
  });
};

export default useFrameElapsed;
