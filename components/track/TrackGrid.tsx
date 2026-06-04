import { Track } from "@/types/track";
import TrackCard from "./TrackCard";

interface TrackGridProps {
    tracks: Track[];
    emptyMessage?: string;
}

export default function TrackGrid({
    tracks,
    emptyMessage = "No tracks found.",
}: TrackGridProps) {
    if (tracks.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-muted-foreground text-sm">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
            ))}
        </div>
    );
}
