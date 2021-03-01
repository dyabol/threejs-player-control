import { Keys as KeyType, useKeyboard } from "../../zustand/KeyboardStore";
import { getPlayerId } from "./Game";

export type Keys = KeyType;

const keyMap: { [key: string]: keyof Keys } = {
  Space: "space",
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  ShiftLeft: "shift",
};

const keysInit: Keys = {
  space: false,
  forward: false,
  backward: false,
  left: false,
  right: false,
  shift: false,
};

const onKeyDownHandler = ({ code }: KeyboardEvent) => {
  const { keyDown, keys } = useKeyboard.getState();
  const id = getPlayerId();
  const key = keyMap[code];
  if (key && !keys[id][key]) {
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

export const getKeys = (id: string) => {
  return useKeyboard.getState().keys[id];
};

export const subscribe = (callBack: (keys: Keys) => void) => {
  const id = getPlayerId();
  return useKeyboard.subscribe(callBack, (state) => state.keys[id]);
};

export const setKeys = (keys: Keys, id: string) => {
  useKeyboard.getState().setKeys(keys, id);
};

export const initKeys = (id: string) => {
  useKeyboard.getState().setKeys(keysInit, id);
};
