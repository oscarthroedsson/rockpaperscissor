export default function PlayerScore({ name, score, align }: { name: string; score: number; align: "left" | "right" }) {
  return (
    <div className="flex justify-between items-baseline gap-2 w-full">
      {align === "left" && <Name>{name}</Name>}
      <Score>{score}</Score>
      {align === "right" && <Name>{name}</Name>}
    </div>
  );
}

const Name = ({ children }: { children: string }) => (
  <span className="text-lg lg:text-5xl text-slate-700 font-bold font-[Righteous]">{children}</span>
);

const Score = ({ children }: { children: number }) => (
  <span className="text-lg lg:text-4xl font-bold text-slate-500 tabular-nums font-[Righteous]">{children}</span>
);
