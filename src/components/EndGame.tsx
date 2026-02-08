import { useEffect, useRef } from "react";

import { useGame } from "../hook/useGameController";
import { clearUrl } from "../service/urlService";
import { useGameScore } from "../hook/useGameScore";

export default function EndGame() {
  const { isGameOver, game, newGame, setGame } = useGame();
  const scoreBoard = useGameScore();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!isGameOver) return;

    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [isGameOver]);
  const { mutateAsync } = newGame;

  if (!isGameOver) return null;

  const winnerIsP1 = scoreBoard.player1 > scoreBoard.player2;
  const winnerKey = winnerIsP1 ? "player1" : "player2";
  const loserKey = winnerIsP1 ? "player2" : "player1";

  const winner = game?.[winnerKey]?.name;
  const loser = game?.[loserKey]?.name;

  function handleNewGame() {
    if (!game?.player1?.name || !game?.player2?.name) return;
    mutateAsync({ pOne: game.player1.name, pTwo: game.player2.name });
  }

  function handleExit() {
    setGame(null);
    clearUrl();
  }

  return (
    <dialog
      ref={dialogRef}
      className="
        fixed inset-0 z-50 m-0 p-0 mx-auto w-screen h-screen flex items-center justify-center 
        bg-transparent backdrop:bg-black/30 backdrop:backdrop-blur-sm
        focus:shadow-blue-500
        "
    >
      <div className="w-[90%] max-w-sm rounded-xl mx-auto bg-white p-6 shadow-xl">
        <header className="text-center space-y-1">
          <h2 className="text-xs uppercase tracking-wide text-slate-400">Game over</h2>
          <p className="text-2xl font-semibold text-slate-800">{winner} wins</p>
          <p className="text-sm text-slate-500">{loser} fought well</p>
        </header>

        <p className="mt-4 text-center text-xs text-slate-400">{game?.finishedRounds.length} rounds played</p>

        <footer aria-label="Game actions" className="mt-6 flex flex-col gap-2 ">
          <button
            onClick={handleNewGame}
            className="w-full rounded-md bg-amber-400 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:shadow-blue-500"
          >
            Play again
          </button>

          <button
            onClick={handleExit}
            className="w-full rounded-md border border-slate-200 py-2 text-sm text-slate-500 hover:bg-slate-50 focus:shadow-blue-500"
          >
            Exit
          </button>
        </footer>
      </div>
    </dialog>
  );
}
