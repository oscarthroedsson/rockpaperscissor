import { moveImages, moves } from "../constant/game.constants";
import { useGame } from "../hook/useGameController";
import type { MoveEnum } from "../types/game.types";
import Waiting from "./Waiting";

export default function PlayerSection({ player }: { player: "player1" | "player2" }) {
  const { game, move } = useGame();
  const { mutateAsync } = move;

  const currPlayer = game?.[player] || null;
  const currPlayerMove = game?.currentRound?.[`${player}Move`] || null;

  const handleMove = async (selectedMove: MoveEnum) => {
    if (!game || !currPlayer) {
      console.error("Can´t fetch");
      console.error({ game, currPlayer });
      return;
    }

    await mutateAsync({ playerId: currPlayer.id, gameId: game.id, move: selectedMove });
  };

  return (
    <div
      className={`relative flex flex-col h-full w-full overflow-hidden
        ${
          player === "player1"
            ? "bg-linear-to-br from-gray-50 to-gray-100"
            : "bg-linear-to-br from-slate-100 to-slate-50"
        }`}
    >
      {!game ? null : (
        <div
          className={`relative z-10 flex gap-6 lg:h-full justify-center lg:items-center
            ${player === "player1" ? "mt-auto mb-20 lg:mb-0 lg:ml-auto lg:mr-20" : "mt-20 lg:mt-0 lg:mr-auto lg:ml-20"}
          `}
        >
          {currPlayerMove?.length ? (
            <Waiting choosen={currPlayerMove} />
          ) : (
            <>
              {moves.map((m) => (
                <button
                  key={m}
                  onClick={() => handleMove(m)}
                  className="w-24 h-24 hover:scale-110 transition-transform duration-200 cursor-pointer active:scale-95 focus:*:drop-shadow-blue-500"
                  aria-label={`${currPlayer?.name} hovering ${m}`}
                >
                  <img
                    src={moveImages[m]}
                    alt={m}
                    className="w-full h-full object-contain drop-shadow-lg hover:drop-shadow-2xl transition-all"
                  />
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
