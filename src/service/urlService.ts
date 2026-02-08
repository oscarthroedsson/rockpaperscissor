export function getUrl(): { id: string; rounds: number | null } | null {
  const path = window.location.pathname.slice(1);
  if (!path) return null;
  const [id, roundsStr] = path.split("/");
  if (!id) return null;

  const rounds = parseInt(roundsStr, 10);
  return {
    id,
    rounds: Number.isNaN(rounds) ? null : rounds,
  };
}

export function setUrl(gameId: string, rounds: number): void {
  window.history.pushState({}, "", `/${gameId}/${rounds}`);
}

export function clearUrl(): void {
  window.history.pushState({}, "", "/");
}

export function replaceUrl(gameId: string, rounds: number): void {
  window.history.replaceState({}, "", `/${gameId}.${rounds}`);
}
