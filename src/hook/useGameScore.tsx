import { useMemo } from "react";

import { winConditions } from "../constant/game.constants";
import { useGame } from "./useGameController";

export function useGameScore() {
  const { game } = useGame();

  return useMemo(() => {
    if (!game?.finishedRounds?.length) return { player1: 0, player2: 0 };

    let p1 = 0;
    let p2 = 0;

    for (const round of game.finishedRounds) {
      if (winConditions[round.player1Move] === round.player2Move) p1++;
      else if (winConditions[round.player2Move] === round.player1Move) p2++;
    }

    return { player1: p1, player2: p2 };
  }, [game?.finishedRounds]);
}
