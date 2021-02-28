import create from "zustand";

type OrbitState = {
  orbitEnabled: boolean;
  setOrbitEnabled: (orbitEnabled: boolean) => void;
};

export const useOrbit = create<OrbitState>((set) => ({
  orbitEnabled: true,
  setOrbitEnabled: (orbitEnabled) => set({ orbitEnabled }),
}));
