import type { Game, MoveEnum, Player, Round } from "../types/game.types";

const BASE_URL = "https://rps-api-ujymak7y3a-ew.a.run.app";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}

export const gameApi = {
  getAll: () => request<Game[]>(`${BASE_URL}/games`),
  getGame: (id: string) => request<Game>(`${BASE_URL}/games/${id}`),
  getRound: (gameId: string, roundId: string) => request<Round>(`${BASE_URL}/games/${gameId}/round/${roundId}`),

  createGame: () =>
    request<Game>(`${BASE_URL}/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }),

  addPlayer: (name: string, gameId: string) =>
    request<Player>(`${BASE_URL}/games/${gameId}/addPlayer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }),

  move: (playerId: string, gameId: string, move: MoveEnum) =>
    request<Round>(`${BASE_URL}/games/${gameId}/doMove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, move }),
    }),
};
