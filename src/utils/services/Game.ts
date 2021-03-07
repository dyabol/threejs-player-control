import { useGame } from "../../zustand/GameStore";

export const getPlayerId = () => {
  const id = useGame.getState().clientId;
  if (!id) {
    throw new Error("Player id is missing.");
  }
  return id;
};

export const initComplete = (callback: (initialized: boolean) => void) =>
  useGame.subscribe(callback, (state) => state.clientId != null);

export const setPlayerPosition = (position: [number, number, number]): void => {
  const state = useGame.getState();
  const id = state.clientId;
  if (id) {
    state.setPosition(id, position);
  }
};

export const setPlayerVelocity = (velocity: [number, number, number]): void => {
  const state = useGame.getState();
  const id = state.clientId;
  if (id) {
    state.setVelocity(id, velocity);
  }
};

export const setPlayerQuaternion = (
  quaternion: [number, number, number, number]
): void => {
  const state = useGame.getState();
  const id = state.clientId;
  if (id) {
    state.setQuaternion(id, quaternion);
  }
};

export const getPlayerPosition = (): [number, number, number] => {
  const state = useGame.getState();
  const id = state.clientId;
  if (id) {
    const position = state.playerStates[id]?.position;
    if (position) {
      return position;
    }
  }
  return [0, 0, 0];
};

export const getPlayerVelocity = (): [number, number, number] => {
  const state = useGame.getState();
  const id = state.clientId;
  if (id) {
    const velocity = state.playerStates[id]?.velocity;
    if (velocity) {
      return velocity;
    }
  }
  return [0, 0, 0];
};

export const getPlayerQuaternion = (): [number, number, number, number] => {
  const state = useGame.getState();
  const id = state.clientId;
  if (id) {
    const quaternion = state.playerStates[id]?.quaternion;
    if (quaternion) {
      return quaternion;
    }
  }
  return [0, 0, 0, 0];
};
