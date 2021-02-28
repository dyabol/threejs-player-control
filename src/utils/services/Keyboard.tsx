import create from "zustand";
import { immer } from "../middleware/Immer";

export type Keys = {
  forward: boolean;
  backward: boolean;
  space: boolean;
  shift: boolean;
  left: boolean;
  right: boolean;
};

const keyMap: { [key: string]: keyof Keys } = {
  Space: "space",
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  ShiftLeft: "shift",
};

export type KeyboradState = {
  keys: Keys;
  keyDown: (key: keyof Keys) => void;
  keyUp: (key: keyof Keys) => void;
};

export const useKeyBoard = create<KeyboradState>(
  immer((set) => ({
    keys: {
      space: false,
      forward: false,
      backward: false,
      left: false,
      right: false,
      shift: false,
    },
    keyDown: (key) => set((state) => void (state.keys[key] = true)),
    keyUp: (key) => set((state) => void (state.keys[key] = false)),
  }))
);

const onKeyDownHandler = ({ code }: KeyboardEvent) => {
  const { keyDown, keys } = useKeyBoard.getState();
  const key = keyMap[code];
  if (key && !keys[key]) {
    keyDown(key);
  }
};
const onKeyUpHandler = ({ code }: KeyboardEvent) => {
  const { keyUp } = useKeyBoard.getState();
  const key = keyMap[code];
  if (key) {
    keyUp(key);
  }
};

export const getKeys = () => {
  return useKeyBoard.getState().keys;
};

export const subscribe = (callBack: (keys: Keys) => void) => {
  return useKeyBoard.subscribe(callBack, (state) => state.keys);
};

window.addEventListener("keydown", onKeyDownHandler, false);
window.addEventListener("keyup", onKeyUpHandler, false);
