import { useEffect, useState } from "react";

const keyMap: { [key: string]: string } = {
  Space: "jump",
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  Shift: "run",
};

const useKeyState = () => {
  const [keys, setKeys] = useState({
    jump: false,
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
  });

  useEffect(() => {
    const onKeyDownHandler = ({ code }: KeyboardEvent) => {
      setKeys((k) => ({ ...k, [keyMap[code]]: true }));
    };
    const onKeyUpHandler = ({ code }: KeyboardEvent) => {
      setKeys((k) => ({ ...k, [keyMap[code]]: false }));
    };
    document.addEventListener("keydown", onKeyDownHandler, true);
    document.addEventListener("keyup", onKeyUpHandler, true);
    return () => {
      document.removeEventListener("keydown", onKeyDownHandler, true);
      document.removeEventListener("keyup", onKeyUpHandler, true);
    };
  }, []);

  return keys;
};

export default useKeyState;
