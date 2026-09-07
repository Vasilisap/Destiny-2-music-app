import FavoritesList from "@/components/track/FavoritesList";
import { getAllTracks } from "@/lib/tracks";

export default function FavoritesPage() {
    const tracks = getAllTracks();

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Favorites
                </h1>
            </div>

            <FavoritesList tracks={tracks} />
        </div>
    );
}
