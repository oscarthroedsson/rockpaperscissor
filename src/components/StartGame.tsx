import { useState } from "react";

import { useGame } from "../hook/useGameController";
import Loading from "./Loading";

export default function StartGame() {
  const [pOne, setPOne] = useState("");
  const [pTwo, setPTwo] = useState("");

  const { game, newGame, rounds, setRounds } = useGame();
  const { mutateAsync, isPending } = newGame;

  const nameRegex = /^[A-Za-z]{3,}$/;
  const isValid = nameRegex.test(pOne.trim()) && nameRegex.test(pTwo.trim()) && rounds >= 3;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid) return;
    try {
      const data = await mutateAsync({ pOne, pTwo });
      setPOne("");
      setPTwo("");
      console.log("🥏 GAME: ", data);
    } catch (err) {
      console.error("[StartGame]: err: ", err);
    }
  }

  if (game) return null;

  return (
    <div
      className="fixed z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                 bg-slate-50 border border-slate-200 rounded-lg shadow-lg w-[90%] max-w-sm p-6"
    >
      <p className="mb-4 text-center font-medium">Provide players name</p>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          Player One
          <input
            name="playerOne"
            type="text"
            placeholder="Player One Name"
            value={pOne}
            onChange={(e) => setPOne(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </label>

        <label className="flex flex-col">
          Player Two
          <input
            name="playerTwo"
            type="text"
            placeholder="Player Two Name"
            value={pTwo}
            onChange={(e) => setPTwo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </label>

        <label className="flex flex-col">
          Rounds
          <input
            name="playerTwo"
            type="number"
            placeholder="Player Two Name"
            value={rounds}
            min={3}
            max={10}
            onChange={(e) => setRounds(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
          <p className="text-xs text-slate-400">minimun rounds is 3 & maximum is 10</p>
        </label>

        <button
          type="submit"
          disabled={!isValid}
          aria-label="Start new game with provided player names and rounds"
          className={`w-full text-sm font-semibold px-4 py-2 rounded-md transition-colors min-h-10
                      ${isValid ? "bg-amber-400 hover:bg-amber-500" : "bg-slate-400 text-slate-600 cursor-not-allowed"}`}
        >
          {isPending ? <Loading isLoading={true} /> : "Start"}
        </button>
      </form>
    </div>
  );
}
