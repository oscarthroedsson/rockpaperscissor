export default function Loading({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;

  return (
    <div className="flex flex-row gap-2 justify-center">
      <Ball delay=".0" />
      <Ball delay=".3" />
      <Ball delay=".5" />
    </div>
  );
}

function Ball({ delay }: { delay: string }) {
  return <div className={`w-2 h-2 rounded-full bg-amber-950 animate-bounce [animation-delay:-${delay}]`} />;
}
