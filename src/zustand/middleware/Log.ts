import { State, StateCreator } from "zustand";

export const log = <T extends State>(
  config: StateCreator<T>
): StateCreator<T> => (set, get, api) =>
  config(
    (args) => {
      console.log("  applying", args);
      set(args);
      console.log("  new state", get());
    },
    get,
    api
  );
