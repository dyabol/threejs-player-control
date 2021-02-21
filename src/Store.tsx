import create from "zustand";

type State = {
  orbitEnabled: boolean;
  setOrbitEnabled: (orbitEnabled: boolean) => void;
};

export const useStore = create<State>((set) => ({
  orbitEnabled: true,
  setOrbitEnabled: (orbitEnabled) => set({ orbitEnabled }),
}));
