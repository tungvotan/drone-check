export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-dark-bg">
      {/* Verdict skeleton */}
      <div className="w-48 h-48 rounded-full skeleton mb-8" />

      {/* Weather card skeleton */}
      <div className="w-full max-w-sm space-y-4">
        <div className="h-32 rounded-2xl skeleton" />
        <div className="h-24 rounded-2xl skeleton" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-1 h-20 rounded-xl skeleton" />
          ))}
        </div>
      </div>
    </div>
  );
}
