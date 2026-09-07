import TrackGrid from "@/components/track/TrackGrid";
import { getFavoriteTrackIds } from "@/lib/favorites";
import { getAllTracks } from "@/lib/tracks";

export default function FavoritesPage() {
    const favoriteIds = getFavoriteTrackIds();
    const tracks = getAllTracks().filter((track) =>
        favoriteIds.includes(track.id),
    );

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Favorites
                </h1>
                <p className="text-muted-foreground mt-1">
                    {tracks.length} tracks
                </p>
            </div>

            <TrackGrid
                tracks={tracks}
                favoriteIds={favoriteIds}
                emptyMessage="No favorites yet — click the heart on any track."
            />
        </div>
    );
}
