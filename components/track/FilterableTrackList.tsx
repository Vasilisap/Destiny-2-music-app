import { Expansion, Mood, Track } from "@/types/track";
import TrackFilters from "./TrackFilters";
import TrackGrid from "./TrackGrid";

interface FilterableTrackListProps {
  allTracks: Track[];
  filteredTracks: Track[];
  expansions: Expansion[];
  moods: Mood[];
  selectedExpansion: string | undefined;
  selectedMood: string | undefined;
}

export default function FilterableTrackList({
  allTracks,
  filteredTracks,
  expansions,
  moods,
  selectedExpansion,
  selectedMood,
}: FilterableTrackListProps) {
  return (
    <div>
      <TrackFilters
        expansions={expansions}
        moods={moods}
        selectedExpansion={selectedExpansion}
        selectedMood={selectedMood}
      />

      {/* Result count */}
      <p className="text-sm text-muted-foreground mb-4">
        {filteredTracks.length} of {allTracks.length} tracks
      </p>

      <TrackGrid
        tracks={filteredTracks}
        emptyMessage="No tracks match these filters."
      />
    </div>
  );
}
