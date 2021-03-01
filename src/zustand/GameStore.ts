import create from "zustand";
import { immer } from "./middleware/Immer";

export type GameState = {
  playerList: string[];
  playerId: string | undefined;
  setPlayerId: (id: string) => void;
  setPlayerList: (playerList: string[]) => void;
};

export const useGame = create<GameState>(
  immer((set) => ({
    playerId: undefined,
    playerList: [],
    setPlayerId: (id: string) => set((state) => void (state.playerId = id)),
    setPlayerList: (playerList: string[]) =>
      set((state) => void (state.playerList = playerList)),
  }))
);
