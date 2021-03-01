import { useGame } from "../zustand/GameStore";

const PlayerList: React.FC = () => {
  const { playerList, playerId } = useGame(({ playerList, playerId }) => ({
    playerList,
    playerId,
  }));
  console.log(playerList);
  return (
    <ul style={{ position: "absolute", right: 10, top: 10, zIndex: 1 }}>
      {playerList.map((id, index) => (
        <li key={index}>{playerId === id ? <b>{id}</b> : id}</li>
      ))}
    </ul>
  );
};

export default PlayerList;
