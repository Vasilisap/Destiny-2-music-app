import { filterTracks } from "@/lib/tracks";
import { Expansion, Mood, Track } from "@/types/track";
import FilterableTrackList from "./FilterableTrackList";

interface FilteredTrackListProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  allTracks: Track[];
  expansions: Expansion[];
  moods: Mood[];
}

export default async function FilteredTrackList({
  searchParams,
  allTracks,
  expansions,
  moods,
}: FilteredTrackListProps) {
  const { expansion, mood } = await searchParams;

  const expansionFilter = typeof expansion === "string" ? expansion : undefined;
  const moodFilter = typeof mood === "string" ? mood : undefined;

  const filteredTracks = filterTracks(allTracks, expansionFilter, moodFilter);

  return (
    <FilterableTrackList
      allTracks={allTracks}
      filteredTracks={filteredTracks}
      expansions={expansions}
      moods={moods}
      selectedExpansion={expansionFilter}
      selectedMood={moodFilter}
    />
  );
}
