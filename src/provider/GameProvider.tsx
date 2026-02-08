import { useMutation, useQuery } from "@tanstack/react-query";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Dispatch, SetStateAction } from "react";

import { GameContext } from "../context/GameController.context";
import { gameApi } from "../service/gameService";
import { getUrl, setUrl } from "../service/urlService";
import type { AllGames, FinishedRound, Game, MoveEnum, Player, Round } from "../types/game.types";

export interface GameContextType {
  game: Game | null;
  setGame: Dispatch<SetStateAction<Game | null>>;

  rounds: number;
  setRounds: Dispatch<SetStateAction<number>>;

  // Queries
  gamesQuery: UseQueryResult<AllGames, Error>;
  GameQuery: (gameId: string) => UseQueryResult<Game, Error>;
  RoundQuery: (gameId: string, roundId: string) => UseQueryResult<Game["currentRound"], Error>;

  // Mutations
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

      console.log("📂 LOAD GAME IS RUN");
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
        console.log("Loaded game:", existingGame);
      } catch (error) {
        console.error("Failed to load game from URL:", error);
      }
    };
    loadGame();
  }, [game]);

  // Not using
  const gamesQuery = useQuery<AllGames, Error>({
    queryKey: ["games"],
    queryFn: () => gameApi.getAll(),
  });

  // not using
  const GameQuery = (gameId: string) => {
    return useQuery<Game, Error>({
      queryKey: ["game", gameId],
      queryFn: () => gameApi.getGame(gameId),
      enabled: !!gameId,
    });
  };

  // Not using
  const RoundQuery = (gameId: string, roundId: string) =>
    useQuery<Game["currentRound"], Error>({
      queryKey: ["round", gameId, roundId],
      queryFn: () => gameApi.getRound(gameId, roundId),
      enabled: !!gameId && !!roundId,
    });

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
    onError: (_, __, context) => {
      if (context?.game) setGame(context.game); // Rollback on game-state
    },
    onSuccess: async (move) => {
      if (!move?.player1Move || !move.player2Move) return;

      console.log("MOVE: ", move);

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

        gamesQuery,
        GameQuery,
        RoundQuery,
        newGame,
        move,

        isGameOver: game?.finishedRounds.length === rounds,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
