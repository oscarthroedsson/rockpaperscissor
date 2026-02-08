import { moveImages } from "../../constant/game.constants";

type Round = {
  id?: string;
  player1Move: keyof typeof moveImages;
  player2Move: keyof typeof moveImages;
};

type Props = {
  rounds: Round[];
  player1Name?: string | null;
  player2Name?: string | null;
};

export default function RoundHistory({ rounds, player1Name, player2Name }: Props) {
  return (
    <ol className="flex lg:justify-center gap-2 overflow-x-auto pb-2">
      {rounds.map((round, index) => (
        <li
          key={round.id ?? `round-${index}`}
          tabIndex={0}
          className="border-2 border-white rounded-lg p-2 bg-linear-to-r from-blue-50/20 to-slate-50 shadow-sm shrink-0"
          aria-label={`Round ${index + 1} ${player1Name} did ${round.player1Move} and ${player2Name} did ${round.player2Move}`}
        >
          <div className="flex flex-col gap-1">
            <span aria-label={`Round ${index + 1}`} className="text-[8px] text-gray-400">
              R{index + 1}
            </span>

            <div className="flex items-center gap-2">
              <span className="truncate max-w-10 text-xs">{player1Name || "Player 1"}</span>
              <img
                src={moveImages[round.player2Move]}
                alt={`${player1Name} did ${round.player1Move}`}
                className="w-6 h-6 object-contain shrink-0"
              />
              <span className="text-[10px] text-gray-300">vs</span>
              <img
                src={moveImages[round.player2Move]}
                alt={`${player2Name} did ${round.player2Move}`}
                className="w-6 h-6 object-contain shrink-0"
              />
              <span className="truncate max-w-10 text-xs">{player2Name || "Player 2"}</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
