import { useGame } from "../zustand/GameStore";

const PlayerList: React.FC = () => {
  const { playerList, clientId } = useGame(({ playerList, clientId }) => ({
    playerList,
    clientId,
  }));
  return (
    <ul style={{ position: "absolute", right: 10, top: 10, zIndex: 1 }}>
      {playerList.map((id, index) => (
        <li key={index}>{clientId === id ? <b>{id}</b> : id}</li>
      ))}
    </ul>
  );
};

export default PlayerList;
