export type MoveEnum = "ROCK" | "PAPER" | "SCISSOR";

export type AllGames = Game[];

export interface Game {
  id: string;
  player1: Player | null;
  player2: Player | null;
  currentRound: Round | null;
  finishedRounds: FinishedRound[];
}

export interface Player {
  id: string;
  name: string | null;
}

export interface Round {
  id: string;
  player1Move: MoveEnum | null;
  player2Move: MoveEnum | null;
}

export interface FinishedRound {
  id: string;
  player1Move: MoveEnum;
  player2Move: MoveEnum;
}
