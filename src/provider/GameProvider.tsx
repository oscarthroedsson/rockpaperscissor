import { useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import { GameContext } from "../context/GameController.context";
import type { Game } from "../game.types";
export interface GameContextType {
  game: Game | null;
  setGame: Dispatch<SetStateAction<Game | null>>;
}
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, setGame] = useState<Game | null>(null);

  // Querys

  return (
    <GameContext.Provider
      value={{
        game,
        setGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
