import { useEffect, useRef } from "react";

const keyMap: { [key: string]: string } = {
  Space: "jump",
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  ShiftLeft: "run",
};

const InitValue = {
  jump: false,
  forward: false,
  backward: false,
  left: false,
  right: false,
  run: false,
};

export type Keys = typeof InitValue;

export const useKeyState = (callBack?: (keys: Keys) => void) => {
  const keys = useRef<Keys>(InitValue);

  useEffect(() => {
    const onKeyDownHandler = ({ code }: KeyboardEvent) => {
      const newState = { ...keys.current, [keyMap[code]]: true };
      callBack?.(newState);
      keys.current = newState;
    };
    const onKeyUpHandler = ({ code }: KeyboardEvent) => {
      const newState = { ...keys.current, [keyMap[code]]: false };
      callBack?.(newState);
      keys.current = newState;
    };
    document.addEventListener("keydown", onKeyDownHandler, true);
    document.addEventListener("keyup", onKeyUpHandler, true);
    return () => {
      document.removeEventListener("keydown", onKeyDownHandler, true);
      document.removeEventListener("keyup", onKeyUpHandler, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return keys;
};
