import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Dispatch, SetStateAction } from "react";

import { GameContext } from "../context/GameController.context";
import { winConditions } from "../constant/game.constants";
import { gameServiceSingelton } from "../service/gameService";
import type { AllGames, Game, MoveEnum, Player, Round } from "../game.types";

export interface GameContextType {
  game: Game | null;
  setGame: Dispatch<SetStateAction<Game | null>>;

  rounds: number;
  setRounds: Dispatch<SetStateAction<number>>;

  scoreBoard: { player1: number; player2: number };

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
  const [game, setGame] = useState<Game | null>(null);
  const [rounds, setRounds] = useState<number>(3);
  const queryClient = useQueryClient();

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

  const newGame = useMutation<{ game: Game; players: Player[] }, Error, { pOne: string; pTwo: string }>({
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

      /**
       * TODO take note that the response is not to be trusted
       * When player X sends in a move we sometimes get back that it was player Y that made a move
       */

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

        rounds,
        setRounds,

        scoreBoard,

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
