import type { MoveEnum } from "../game.types";

export const moves: MoveEnum[] = ["ROCK", "PAPER", "SCISSOR"];

export const moveImages: Record<MoveEnum, string> = {
  ROCK: "/rock.svg",
  PAPER: "/paper.svg",
  SCISSOR: "/scissors.svg",
};

export const winConditions: Record<MoveEnum, MoveEnum> = {
  ROCK: "SCISSOR",
  PAPER: "ROCK",
  SCISSOR: "PAPER",
};
