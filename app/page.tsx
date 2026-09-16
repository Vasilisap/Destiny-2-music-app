import FilteredTrackList from "@/components/track/FilteredTrackList";
import TrackListSkeleton from "@/components/track/TrackListSkeleton";
import { getAllExpansions, getAllMoods, getAllTracks } from "@/lib/tracks";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const tracks = getAllTracks();
  const expansions = getAllExpansions();
  const moods = getAllMoods();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Destiny 2 OST</h1>
        <p className="text-muted-foreground mt-1">
          {tracks.length} tracks across {expansions.length} expansions
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Browse by mood
        </h2>
        <div className="flex flex-wrap gap-2">
          {moods.map((mood) => (
            <Link
              key={mood}
              href={`/mood/${mood}`}
              className="rounded-full border px-4 py-1.5 text-sm capitalize transition-colors hover:bg-secondary hover:text-foreground text-muted-foreground"
            >
              {mood}
            </Link>
          ))}
        </div>
      </div>

      {/* Track grid */}
      <Suspense fallback={<TrackListSkeleton />}>
        <FilteredTrackList
          searchParams={searchParams}
          allTracks={tracks}
          expansions={expansions}
          moods={moods}
        />
      </Suspense>
    </div>
  );
}
