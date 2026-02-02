import type { MoveEnum } from "../game.types";

const BASE_URL = "https://rps-api-ujymak7y3a-ew.a.run.app";

export class GameRepository {
  getAll() {
    return fetch(`${BASE_URL}/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  getGame(gameId: string) {
    return fetch(`${BASE_URL}/games/${gameId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  getRound(gameId: string, roundId: string) {
    return fetch(`${BASE_URL}/games/${gameId}/round/${roundId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async createGame() {
    return fetch(`${BASE_URL}/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async addPlayer(name: string, gameId: string) {
    return fetch(`${BASE_URL}/games/${gameId}/addPlayer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });
  }

  move(playerId: string, gameId: string, move: MoveEnum) {
    return fetch(`${BASE_URL}/games/${gameId}/doMove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        playerId,
        move,
      }),
    });
  }
}
