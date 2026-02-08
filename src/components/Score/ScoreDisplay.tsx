import PlayerScore from "./PlayerScore";

type Props = {
  player1: string;
  player2: string;
  score1: number;
  score2: number;
};

export default function ScoreDisplay({ player1, player2, score1, score2 }: Props) {
  return (
    <div className="flex items-center justify-center w-full gap-2 px-2 lg:px-6">
      <PlayerScore name={player1} score={score1} align="left" />

      <div className="text-gray-300 text-xl lg:mt-2">−</div>

      <PlayerScore name={player2} score={score2} align="right" />
    </div>
  );
}
