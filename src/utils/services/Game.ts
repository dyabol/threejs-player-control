import { useGame } from "../../zustand/GameStore";

export const getPlayerId = () => {
  const id = useGame.getState().playerId;
  if (!id) {
    throw new Error("Player id is missing.");
  }
  return id;
};

export const initComplete = (callback: (initialized: boolean) => void) =>
  useGame.subscribe(callback, (state) => state.playerId != null);
