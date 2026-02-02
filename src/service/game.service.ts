import { GameRepository } from "../repository/game.repository";
import type { MoveEnum } from "../game.types";

export class GameService {
  private repo: GameRepository;

  constructor(repo: GameRepository) {
    this.repo = repo;
  }

  async getAll() {
    const res = await this.repo.getAll();

    if (!res.ok) {
      const txt = res.text();
      console.error("[GameService]-[getRound]- getGame:", txt);
    }

    return res.json();
  }

  async getGame(gameId: string) {
    const res = await this.repo.getGame(gameId);

    if (!res.ok) {
      const txt = res.text();
      console.error("[GameService]-[getRound]- getGame:", txt);
    }

    return res.json();
  }

  async getRound(gameId: string, roundId: string) {
    const res = await this.repo.getRound(gameId, roundId);
    if (!res.ok) {
      const txt = res.text();
      console.error("[GameService]-[getRound]- txt:", txt);
    }

    return res.json();
  }

  async createGame() {
    const res = await this.repo.createGame();
    if (!res.ok) {
      const txt = res.text();
      console.error("[GameService]-[createGame]- txt:", txt);
    }

    return res.json();
  }

  async addPlayer(name: string, gameId: string) {
    const res = await this.repo.addPlayer(name, gameId);

    if (!res.ok) {
      const txt = res.text();
      console.error("[GameService]-[addPlayer]- txt:", txt);
    }

    return res.json();
  }

  async move(playerId: string, gameId: string, move: MoveEnum) {
    const res = await this.repo.move(playerId, gameId, move);

    if (!res.ok) {
      const txt = res.text();
      console.error("[GameService]-[move]- txt:", txt);
    }

    return res.json();
  }
}
