import { Keys as KeyType, useKeyboard } from "../../zustand/KeyboardStore";

export type Keys = KeyType;

const keyMap: { [key: string]: keyof Keys } = {
  Space: "space",
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  ShiftLeft: "shift",
};

const onKeyDownHandler = ({ code }: KeyboardEvent) => {
  const { keyDown, keys } = useKeyboard.getState();
  const key = keyMap[code];
  if (key && !keys[key]) {
    keyDown(key);
  }
};
const onKeyUpHandler = ({ code }: KeyboardEvent) => {
  const { keyUp } = useKeyboard.getState();
  const key = keyMap[code];
  if (key) {
    keyUp(key);
  }
};

export const init = () => {
  window.addEventListener("keydown", onKeyDownHandler, false);
  window.addEventListener("keyup", onKeyUpHandler, false);
};

export const getKeys = () => {
  return useKeyboard.getState().keys;
};

export const subscribe = (callBack: (keys: Keys) => void) => {
  return useKeyboard.subscribe(callBack, (state) => state.keys);
};
