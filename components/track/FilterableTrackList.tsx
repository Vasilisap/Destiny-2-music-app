"use client";

import { Expansion, Mood, Track } from "@/types/track";
import { useState } from "react";
import TrackFilters from "./TrackFilters";
import TrackGrid from "./TrackGrid";

interface FilterableTrackListProps {
    tracks: Track[];
    expansions: Expansion[];
    moods: Mood[];
    favoriteIds: string[];
}

export default function FilterableTrackList({
    tracks,
    expansions,
    moods,
    favoriteIds,
}: FilterableTrackListProps) {
    const [selectedExpansion, setSelectedExpansion] =
        useState<Expansion | null>(null);

    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

    const filteredTracks = tracks.filter((track) => {
        const matchesExpansion = selectedExpansion
            ? track.expansion === selectedExpansion
            : true;

        const matchesMood = selectedMood
            ? track.mood.includes(selectedMood)
            : true;

        return matchesExpansion && matchesMood;
    });

    function handleClear() {
        setSelectedExpansion(null);
        setSelectedMood(null);
    }

    return (
        <div>
            <TrackFilters
                expansions={expansions}
                moods={moods}
                selectedExpansion={selectedExpansion}
                selectedMood={selectedMood}
                onExpansionChange={setSelectedExpansion}
                onMoodChange={setSelectedMood}
                onClear={handleClear}
            />

            {/* Result count */}
            <p className="text-sm text-muted-foreground mb-4">
                {filteredTracks.length} of {tracks.length} tracks
            </p>

            <TrackGrid
                tracks={filteredTracks}
                favoriteIds={favoriteIds}
                emptyMessage="No tracks match these filters."
            />
        </div>
    );
}
