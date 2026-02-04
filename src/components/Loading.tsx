export default function Loading({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;

  return (
    <div className="flex flex-row gap-2">
      <div className="w-4 h-4 rounded-full bg-slate-800 animate-bounce"></div>
      <div className="w-4 h-4 rounded-full bg-slate-800 animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-slate-800 animate-bounce [animation-delay:-.5s]"></div>
    </div>
  );
}
