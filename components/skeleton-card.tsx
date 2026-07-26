export function SkeletonCard() {
  return (
    <div className="flex flex-col border border-emerald-900/40 bg-[#0a140a]/60 backdrop-blur p-6 rounded-xl">
      <div className="h-4 w-20 bg-emerald-900/30 rounded mb-4" />
      <div className="h-6 bg-zinc-800/50 rounded mb-2 w-3/4" />
      <div className="h-4 bg-zinc-800/30 rounded mb-4 w-1/2" />
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-zinc-800/20 rounded w-full" />
        <div className="h-3 bg-zinc-800/20 rounded w-full" />
        <div className="h-3 bg-zinc-800/20 rounded w-2/3" />
      </div>
      <div className="h-8 bg-emerald-900/30 rounded-lg mt-6 w-24" />
    </div>
  );
}
