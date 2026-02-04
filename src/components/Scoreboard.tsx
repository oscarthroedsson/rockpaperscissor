import { useMemo } from "react";

import { winConditions } from "../constant/game.constants";
import { useGame } from "../hook/useGameController";

export default function Scoreboard() {
  const { game } = useGame();

  const scoreBoard = useMemo(() => {
    if (!game?.finishedRounds || game.finishedRounds.length === 0) {
      return { player1: 0, player2: 0 };
    }

    let p1Score = 0;
    let p2Score = 0;

    for (const round of game.finishedRounds) {
      if (winConditions[round.player1Move] === round.player2Move) {
        p1Score++;
      } else if (winConditions[round.player2Move] === round.player1Move) {
        p2Score++;
      }
    }

    return { player1: p1Score, player2: p2Score };
  }, [game?.finishedRounds]);

  return (
    <section
      aria-label="Scoreboard"
      className=" absolute left-1/2 -translate-x-1/2 top-5
      flex flex-col items-center p-2 h-fit bg-slate-200  text-white rounded-xl shadow-lg w-fit mx-auto"
    >
      <h2 className="sr-only">Current score</h2>

      <div className="flex items-center justify-between w-80">
        <div className="flex  items-center  justify-between gap-2 grow">
          <span className="bg-amber-400 rounded-xl px-2 py-1.5 border-amber-600 border-4 font-bold">
            {game?.player1?.name ?? "P1"}
          </span>
          <div
            role="status"
            aria-live="polite"
            aria-label={`Points player one: ${scoreBoard.player1}`}
            className="tabular-nums transition-all duration-200 text-2xl"
          >
            {scoreBoard.player1}
          </div>
        </div>

        <div aria-hidden="true" className="text-gray-600 animate-pulse mx-2">
          :
        </div>

        <div className="flex items-center justify-between grow">
          <div
            role="status"
            aria-live="polite"
            aria-label={`Poäng Spelare 2: ${scoreBoard.player2}`}
            className="tabular-nums transition-all duration-200 text-2xl"
          >
            {scoreBoard.player2}
          </div>
          <span className="bg-amber-400 rounded-xl px-2 py-1.5 border-amber-600 border-4 font-bold">
            {game?.player2?.name ?? "P2"}
          </span>
        </div>
      </div>
    </section>
  );
}
