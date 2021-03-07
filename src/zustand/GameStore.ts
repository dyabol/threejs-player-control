import create from "zustand";
import { immer } from "./middleware/Immer";

type PlayerState = {
  position: [number, number, number];
  velocity: [number, number, number];
  quaternion: [number, number, number, number];
  name: string;
};

export type GameState = {
  playerStates: { [key: string]: PlayerState };
  playerList: string[];
  clientId: string | undefined;
  setPlayerState: (id: string, playerState: PlayerState) => void;
  setClientId: (id: string) => void;
  newPlayer: (id: string) => void;
  leavePlayer: (id: string) => void;
  setPosition: (id: string, position: [number, number, number]) => void;
  setVelocity: (id: string, velocity: [number, number, number]) => void;
  setQuaternion: (
    id: string,
    quaternion: [number, number, number, number]
  ) => void;
};

export const useGame = create<GameState>(
  immer((set) => ({
    playerStates: {},
    playerList: [],
    clientId: undefined,
    setPlayerState: (id, playerState) =>
      set((state) => void (state.playerStates[id] = playerState)),
    setClientId: (id) =>
      set((state) => {
        state.clientId = id;
        state.playerStates[id] = {
          position: [0, 0, 0],
          velocity: [0, 0, 0],
          quaternion: [0, 0, 0, 0],
          name: "Jakub",
        };
      }),
    newPlayer: (id) => set((state) => void state.playerList.push(id)),
    leavePlayer: (id) =>
      set(
        (state) => void state.playerList.filter((playerId) => id !== playerId)
      ),
    setPosition: (id, position) =>
      set((state) => void (state.playerStates[id].position = position)),
    setVelocity: (id, velocity) =>
      set((state) => void (state.playerStates[id].velocity = velocity)),
    setQuaternion: (id, quaternion) =>
      set((state) => void (state.playerStates[id].quaternion = quaternion)),
  }))
);
