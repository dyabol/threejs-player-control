import { createContext, useContext, useEffect, useRef } from "react";

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

export const KeyContext = createContext<{
  keys: React.MutableRefObject<Keys>;
  listeners: React.MutableRefObject<((keys: Keys) => void)[]>;
} | null>(null);

export const KeyProvider: React.FC = (props) => {
  const keys = useRef<Keys>(InitValue);
  const listeners = useRef<((keys: Keys) => void)[]>([]);

  const onKeyDownHandler = ({ code }: KeyboardEvent) => {
    const key = keyMap[code] as keyof Keys;
    if (!keys.current[key]) {
      const newState = { ...keys.current, [keyMap[code]]: true };
      listeners.current.forEach((cb) => {
        cb(newState);
      });
      keys.current = newState;
    }
  };
  const onKeyUpHandler = ({ code }: KeyboardEvent) => {
    const newState = { ...keys.current, [keyMap[code]]: false };
    listeners.current.forEach((cb) => {
      cb(newState);
    });
    keys.current = newState;
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDownHandler, false);
    window.addEventListener("keyup", onKeyUpHandler, false);
    return () => {
      window.removeEventListener("keydown", onKeyDownHandler, false);
      window.removeEventListener("keyup", onKeyUpHandler, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <KeyContext.Provider {...props} value={{ keys, listeners }} />;
};

export const useKeyState = (callBack?: (keys: Keys) => void) => {
  const context = useContext(KeyContext);
  if (!context) {
    throw new Error("Aaaa");
  }
  useEffect(() => {
    if (callBack) {
      context.listeners.current.push(callBack);
    }
    return () => {
      context.listeners.current = context.listeners.current.filter(
        (cb) => cb !== callBack
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return context.keys;
};
