import React from "react";
import { useGame } from "../zustand/GameStore";
import Enemy from "./Enemy";

const Enemies: React.FC = () => {
  const enemies = useGame(({ playerList, playerId }) =>
    playerList.filter((p) => p !== playerId)
  );
  return (
    <>
      {enemies.map((e, key) => (
        <Enemy key={key} position={[0, 0, 0]} id={e} />
      ))}
    </>
  );
};

export default Enemies;
