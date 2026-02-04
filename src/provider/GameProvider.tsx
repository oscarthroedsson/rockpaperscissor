import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";
import type { ReactNode } from "react";
import type { Dispatch, SetStateAction } from "react";

import { GameContext } from "../context/GameController.context";
import { gameServiceSingelton } from "../service/gameService";
import type { AllGames, Game, MoveEnum, Player, Round } from "../game.types";

export interface GameContextType {
  game: Game | null;
  setGame: Dispatch<SetStateAction<Game | null>>;

  // Queries
  gamesQuery: UseQueryResult<AllGames, Error>;
  GameQuery: (gameId: string) => UseQueryResult<Game, Error>;
  RoundQuery: (gameId: string, roundId: string) => UseQueryResult<Game["currentRound"], Error>;

  // Mutations
  startGame: UseMutationResult<{ game: Game; players: Player[] }, Error, { pOne: string; pTwo: string }>;
  move: UseMutationResult<Round, Error, { playerId: string; gameId: string; move: MoveEnum }>;

  isGameOver: boolean;
}

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, setGame] = useState<Game | null>(null);
  const queryClient = useQueryClient();

  const gamesQuery = useQuery<AllGames, Error>({
    queryKey: ["games"],
    queryFn: () => gameServiceSingelton.getAll(),
  });

  const GameQuery = (gameId: string) => {
    return useQuery<Game, Error>({
      queryKey: ["game", gameId],
      queryFn: () => gameServiceSingelton.getGame(gameId),
      enabled: !!gameId,
    });
  };

  const RoundQuery = (gameId: string, roundId: string) =>
    useQuery<Game["currentRound"], Error>({
      queryKey: ["round", gameId, roundId],
      queryFn: () => gameServiceSingelton.getRound(gameId, roundId),
      enabled: !!gameId && !!roundId,
    });

  const startGame = useMutation<{ game: Game; players: Player[] }, Error, { pOne: string; pTwo: string }>({
    mutationKey: ["start-game"],
    mutationFn: async ({ pOne, pTwo }) => {
      const newGame = await gameServiceSingelton.createGame();

      const [player1, player2] = await Promise.all([
        gameServiceSingelton.addPlayer(pOne, newGame.id),
        gameServiceSingelton.addPlayer(pTwo, newGame.id),
      ]);

      return {
        game: { ...newGame, player1, player2 },
        players: [player1, player1],
      };
    },
    onSuccess: ({ game }) => setGame(game),
  });

  const move = useMutation<Round, Error, { playerId: string; gameId: string; move: MoveEnum }>({
    mutationKey: ["move"],
    mutationFn: ({ playerId, gameId, move }) => gameServiceSingelton.move(playerId, gameId, move),
    onSuccess: async (newMove, variables) => {
      console.log("On success MOVE: ", newMove);
      console.log("variables: ", variables);

      // If both players have made their moves, invalidate the game query to trigger refetch
      if (newMove.player1Move && newMove.player2Move) {
        console.log("🌈 call game query");
        const updatedGame = await queryClient.fetchQuery({
          queryKey: ["game", variables.gameId],
          queryFn: () => gameServiceSingelton.getGame(variables.gameId),
        });
        setGame(updatedGame);
      } else {
        setGame((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentRound: newMove,
          };
        });
      }
    },
  });

  return (
    <GameContext.Provider
      value={{
        game,
        setGame,
        gamesQuery,
        GameQuery,
        RoundQuery,
        startGame,
        move,

        isGameOver: game?.finishedRounds.length === 3,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
