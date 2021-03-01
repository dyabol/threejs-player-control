import create from "zustand";
import { getPlayerId } from "../utils/services/Game";
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
  keys: { [id: string]: Keys };
  keyDown: (key: keyof Keys) => void;
  keyUp: (key: keyof Keys) => void;
  setKeys: (keys: Keys, id: string) => void;
};

export const useKeyboard = create<KeyboardState>(
  immer((set) => ({
    keys: {},
    keyDown: (key) =>
      set((state) => {
        const id = getPlayerId();
        state.keys[id][key] = true;
      }),
    keyUp: (key) =>
      set((state) => {
        const id = getPlayerId();
        state.keys[id][key] = false;
      }),
    setKeys: (keys, id) => set((state) => void (state.keys[id] = keys)),
  }))
);
