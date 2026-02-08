import { useEffect, useState } from "react";

import { moveImages, moves } from "../constant/game.constants";

export default function Waiting({ choosen }: { choosen: string | null }) {
  const [animIndex, setAnimIndex] = useState(0);

  useEffect(() => {
    if (!choosen) return;

    const interval = setInterval(() => {
      setAnimIndex((i) => (i + 1) % moves.length);
    }, 750);

    return () => clearInterval(interval);
  }, [choosen]);

  return (
    <div className="w-24 h-24">
      <img src={moveImages[moves[animIndex]]} alt="animating" className="w-full h-full object-contain" />
    </div>
  );
}
