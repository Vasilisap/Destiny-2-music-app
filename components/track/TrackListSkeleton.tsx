const PLACEHOLDER_COUNT = 8;

function TrackCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-3 w-20 rounded bg-muted" />
        </div>
        <div className="size-7 shrink-0 rounded-full bg-muted" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <div className="h-5 w-14 rounded-full bg-muted" />
        <div className="h-5 w-16 rounded-full bg-muted" />
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="h-7 w-16 rounded bg-muted" />
      </div>
    </div>
  );
}

export default function TrackListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
        <TrackCardSkeleton key={i} />
      ))}
    </div>
  );
}
