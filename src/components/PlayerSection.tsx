import { useGame } from "../hook/useGameController";
import type { MoveEnum } from "../game.types";
import Waiting from "./Waiting";

const moves: MoveEnum[] = ["ROCK", "PAPER", "SCISSOR"];
const moveImages: Record<MoveEnum, string> = {
  ROCK: "/rock.svg",
  PAPER: "/paper.svg",
  SCISSOR: "/scissors.svg",
};

export default function PlayerSection({ player }: { player: "player1" | "player2" }) {
  const { game, move } = useGame();
  const { mutateAsync, error } = move;

  const currPlayer = game?.[player] || null;
  const currPlayerMove = game?.currentRound?.[`${player}Move`] || null;
  console.log(`👋🏼 Curr Player → ${player} Move: `, currPlayerMove);

  const handleMove = async (selectedMove: MoveEnum) => {
    if (!game || !currPlayer) {
      console.error("Can´t fetch");
      console.error({ game, currPlayer });
      return;
    }

    const data = await mutateAsync({ playerId: currPlayer.id, gameId: game.id, move: selectedMove });
    console.log("🚣🏼 MOVE: ", data);
  };
  console.log("🥎 Game: ", game);
  if (error) console.log("ERROR: ", error);

  return (
    <div className={`flex flex-col h-full w-full ${player === "player1" ? "bg-lime-100" : "bg-blue-100"}`}>
      {!game ? null : (
        <div
          className={`flex gap-4 lg:h-full bg-pink-300/10 justify-center lg:items-center
        ${player === "player1" ? "mt-auto mb-20 lg:ml-auto lg:mr-20" : "mb-auto mt-20 lg:mr-auto lg:ml-20"}
        `}
        >
          {player}

          {currPlayerMove?.length ? (
            <>
              <Waiting choosen={currPlayerMove} />
            </>
          ) : (
            <>
              {moves.map((m) => (
                <div key={m} onClick={() => handleMove(m)} className="w-20 h-20 ">
                  <img
                    src={moveImages[m]}
                    alt={m}
                    className="w-full h-full object-contain drop-shadow-[0_2px_0px_rgba(251,191,36,1)]"
                  />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/*
   <div className="w-24 h-24">
              <img src={moveImages[moves[animIndex]]} alt="animating" className="w-full h-full object-contain" />
            </div>

         
*/
