import { useGame } from "../../hook/useGameController";
import { useGameScore } from "../../hook/useGameScore";
import RoundHistory from "./RoundHistory";
import ScoreDisplay from "./ScoreDisplay";

export default function Scoreboard() {
  const { game, rounds } = useGame();
  const scoreBoard = useGameScore();

  return (
    <section aria-label="Scoreboard" className="absolute top-0 left-0 right-0 z-20 p-4 space-y-2">
      <h2 className="sr-only">Current score</h2>

      <div className="border border-slate-200 pb-2 lg:pb-6 rounded-md">
        <div className="text-center" aria-live="polite" aria-atomic="true">
          <span className="text-gray-400 text-[10px] lg:text-[14px] font-bold uppercase tracking-wider">
            Round {game?.finishedRounds.length ?? 0}/{rounds}
          </span>
        </div>
        <ScoreDisplay
          player1={game?.player1?.name ?? "Player 1"}
          player2={game?.player2?.name ?? "Player 2"}
          score1={scoreBoard.player1}
          score2={scoreBoard.player2}
        />
      </div>

      {game?.finishedRounds && (
        <RoundHistory rounds={game.finishedRounds} player1Name={game.player1?.name} player2Name={game.player2?.name} />
      )}
    </section>
  );
}
