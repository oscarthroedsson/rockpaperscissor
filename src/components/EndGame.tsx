import { useGame } from "../hook/useGameController";

export default function EndGame() {
  const { isGameOver, scoreBoard, game, newGame, setGame } = useGame();
  if (!isGameOver) return null;
  const { mutateAsync } = newGame;

  const winnerBool = scoreBoard.player1 > scoreBoard.player2;
  const winnerKey = winnerBool ? "player1" : "player2";
  const looserKey = winnerBool ? "player2" : "player1";

  const winner = game?.[winnerKey]?.name;
  const otherPlayer = game?.[looserKey]?.name;

  function handleNewGame() {
    if (!game?.player1?.name || !game?.player2?.name) return;
    mutateAsync({ pOne: game?.player1?.name, pTwo: game?.player2?.name });
  }
  return (
    <div
      className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                 bg-slate-50 border border-slate-200 rounded-lg shadow-lg w-[90%] max-w-sm p-6"
    >
      <div>
        <p>{game?.finishedRounds.length} Played</p>

        <span>{winner} IS THE WINNER </span>
        <span>and</span>
        <span>{otherPlayer} IS THE LOOSER</span>
      </div>
      <div>
        <p>Play Again?</p>
        <div>
          <button onClick={() => handleNewGame()}>Yes, please</button>
          <button onClick={() => setGame(null)}>Hell no</button>
        </div>
      </div>
    </div>
  );
}
