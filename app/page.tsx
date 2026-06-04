import FilterableTrackList from "@/components/track/FilterableTrackList";
import { getAllExpansions, getAllMoods, getAllTracks } from "@/lib/tracks";

export default function Home() {
    const tracks = getAllTracks();
    const expansions = getAllExpansions();
    const moods = getAllMoods();
    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Destiny 2 OST
                </h1>
                <p className="text-muted-foreground mt-1">
                    {tracks.length} tracks across {expansions.length} expansions
                </p>
            </div>

            {/* Track grid */}
            <FilterableTrackList
                tracks={tracks}
                expansions={expansions}
                moods={moods}
            />
        </div>
    );
}
