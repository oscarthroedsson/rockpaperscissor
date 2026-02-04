import type { MoveEnum } from "../game.types";

const BASE_URL = "https://rps-api-ujymak7y3a-ew.a.run.app";
// const BASE_URL = "/api";
export class GameService {
  async getAll() {
    const res = await fetch(`${BASE_URL}/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errTxt = await res.text();
      console.error("Error | [GameService]-[getAll] | txt: ", res.status, errTxt);
      throw new Error(`Error | [GameService]-[getAll]`);
    }

    return res.json();
  }

  async getGame(gameId: string) {
    const res = await fetch(`${BASE_URL}/games/${gameId}`);

    if (!res.ok) {
      const errTxt = await res.text();
      console.error("Error | [GameService]-[getGame] | txt: ", res.status, errTxt);
      throw new Error(`Error | [GameService]-[getAll]`);
    }
    return res.json();
  }

  async getRound(gameId: string, roundId: string) {
    const res = await fetch(`${BASE_URL}/games/${gameId}/round/${roundId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errTxt = await res.text();
      console.error("Error | [GameService]-[getRound] | txt: ", res.status, errTxt);
      throw new Error(`Error | [GameService]-[getRound]`);
    }

    return res.json();
  }

  async createGame() {
    const res = await fetch(`${BASE_URL}/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errTxt = await res.text();
      console.error("Error | [GameService]-[createGame] | txt: ", res.status, errTxt);
      throw new Error(`Error | [GameService]-[createGame]`);
    }

    return res.json();
  }

  async addPlayer(name: string, gameId: string) {
    const res = await fetch(`${BASE_URL}/games/${gameId}/addPlayer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });

    if (!res.ok) {
      const errTxt = await res.text();
      console.error("Error | [GameService]-[addPlayer] | txt: ", res.status, errTxt);
      throw new Error(`Error | [GameService]-[addPlayer]`);
    }

    return res.json();
  }

  async move(playerId: string, gameId: string, move: MoveEnum) {
    const res = await fetch(`${BASE_URL}/games/${gameId}/doMove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        playerId,
        move,
      }),
    });

    if (!res.ok) {
      const errTxt = await res.text();
      console.error("Error | [GameService]-[move] | txt: ", res.status, errTxt);
      throw new Error(`Error | [GameService]-[move]`);
    }

    return res.json();
  }
}

export const gameServiceSingelton = new GameService();
