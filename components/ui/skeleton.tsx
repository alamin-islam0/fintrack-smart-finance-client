export function Skeleton({ className = 'h-4 w-full' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-300/60 dark:bg-slate-700/50 ${className}`} />;
}
