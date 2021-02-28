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

export type KeyboardState = {
  keys: Keys;
  keyDown: (key: keyof Keys) => void;
  keyUp: (key: keyof Keys) => void;
};

export const useKeyboard = create<KeyboardState>(
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
