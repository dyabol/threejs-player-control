import create from "zustand";
import { immer } from "./middleware/Immer";

export type Keys = {
  forward: boolean;
  backward: boolean;
  space: boolean;
  shift: boolean;
  left: boolean;
  right: boolean;
};

const keysInit: Keys = {
  space: false,
  forward: false,
  backward: false,
  left: false,
  right: false,
  shift: false,
};

export type KeyboardState = {
  keys: Keys;
  keyDown: (key: keyof Keys) => void;
  keyUp: (key: keyof Keys) => void;
  setKeys: (keys: Keys, id: string) => void;
};

export const useKeyboard = create<KeyboardState>(
  immer((set) => ({
    keys: keysInit,
    keyDown: (key) =>
      set((state) => {
        state.keys[key] = true;
      }),
    keyUp: (key) =>
      set((state) => {
        state.keys[key] = false;
      }),
    setKeys: (keys) => set((state) => void (state.keys = keys)),
  }))
);
