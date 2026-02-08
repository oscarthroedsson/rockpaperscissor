import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Dispatch, SetStateAction } from "react";

import { GameContext } from "../context/GameController.context";
import { gameApi } from "../service/gameService";
import { getUrl, setUrl } from "../service/urlService";
import type { FinishedRound, Game, MoveEnum, Player, Round } from "../types/game.types";

export interface GameContextType {
  game: Game | null;
  setGame: Dispatch<SetStateAction<Game | null>>;

  rounds: number;
  setRounds: Dispatch<SetStateAction<number>>;

  newGame: UseMutationResult<{ game: Game; players: Player[] }, Error, { pOne: string; pTwo: string }>;
  move: UseMutationResult<Round, Error, { playerId: string; gameId: string; move: MoveEnum }>;

  isGameOver: boolean;
}

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, setGame] = useState<Game | null>(null); // gameServiceSingelton.getGame(gameId)
  const [rounds, setRounds] = useState<number>(3);

  useEffect(() => {
    const loadGame = async () => {
      const urlData = getUrl();

      if (!urlData || game) return;

      // Get current game when user hard re-fresh
      try {
        const existingGame = await gameApi.getGame(urlData.id);
        setGame(existingGame);
        setRounds(
          urlData.rounds
            ? urlData.rounds
            : existingGame.finishedRounds.length === 0
              ? 3
              : existingGame.finishedRounds.length,
        );
      } catch (error) {
        console.error("Failed to load game from URL:", error);
      }
    };
    loadGame();
  }, [game]);

  // using
  const newGame = useMutation<{ game: Game; players: Player[] }, Error, { pOne: string; pTwo: string }>({
    mutationKey: ["start-game"],
    mutationFn: async ({ pOne, pTwo }) => {
      const newGame = await gameApi.createGame();

      const [player1, player2] = await Promise.all([
        gameApi.addPlayer(pOne, newGame.id),
        gameApi.addPlayer(pTwo, newGame.id),
      ]);

      setUrl(newGame.id, rounds);

      return {
        game: { ...newGame, player1, player2 },
        players: [player1, player2],
      };
    },
    onError: (err) => {
      // For Dev if something happens that I missed while developing
      console.error("🚨Error [GameProvider | newGame]: ", { ...err });
    },
    onSuccess: ({ game }) => setGame(game),
  });

  // using
  const move = useMutation<
    Round, // res
    Error,
    { playerId: string; gameId: string; move: MoveEnum }, // args
    { game: Game | null; playerKey: string } // context
  >({
    mutationKey: ["move"],
    onMutate: async (variables) => {
      // create correct key for currenRound object
      const playerKey = game?.player1?.id === variables.playerId ? "player1Move" : "player2Move";
      // Optimistic update
      setGame((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentRound: {
            ...prev.currentRound!,
            [playerKey]: variables.move,
          },
        };
      });

      return { game, playerKey };
    },
    mutationFn: ({ playerId, gameId, move }) => gameApi.move(playerId, gameId, move),
    onError: (err, __, context) => {
      if (context?.game) setGame(context.game); // Rollback on game-state

      // For Dev if something happens that I missed while developing
      console.error("🚨Error [GameProvider | move]: ", { ...err });
    },
    onSuccess: async (move) => {
      if (!move?.player1Move || !move.player2Move) return;

      setGame((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentRound: null,
          finishedRounds: [...prev.finishedRounds, { ...prev?.currentRound } as FinishedRound],
        };
      });
    },
  });

  return (
    <GameContext.Provider
      value={{
        game,
        setGame,

        rounds,
        setRounds,

        newGame,
        move,

        isGameOver: game?.finishedRounds.length === rounds,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
