import React from "react";
import { useGame } from "../zustand/GameStore";
import Enemy from "./Enemy";

const Enemies: React.FC = () => {
  const enemies = useGame(({ playerList, clientId }) =>
    playerList.filter((p) => p !== clientId)
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
