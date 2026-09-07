"use client";

import { useFavoritesStore } from "@/hooks/useFavoritesStore";
import { Track } from "@/types/track";
import TrackGrid from "./TrackGrid";

interface FavoritesListProps {
    tracks: Track[];
}

export default function FavoritesList({ tracks }: FavoritesListProps) {
    const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
    const hasHydrated = useFavoritesStore((state) => state.hasHydrated);

    // Before hydration the store is empty, so rendering the grid would
    // flash "No favorites yet" for users who do have favorites.
    if (!hasHydrated) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-muted-foreground text-sm">Loading…</p>
            </div>
        );
    }

    const favoriteTracks = tracks.filter((track) =>
        favoriteIds.includes(track.id),
    );

    return (
        <>
            <p className="text-muted-foreground mb-8 -mt-6">
                {favoriteTracks.length} tracks
            </p>
            <TrackGrid
                tracks={favoriteTracks}
                emptyMessage="No favorites yet — click the heart on any track."
            />
        </>
    );
}
