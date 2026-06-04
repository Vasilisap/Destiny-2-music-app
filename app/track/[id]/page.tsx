import TrackPlayButton from "@/components/track/TrackPlayButton";
import { Badge } from "@/components/ui/badge";
import { expansionToSlug, getAllTracks, getTrackById } from "@/lib/tracks";
import Link from "next/link";
import { notFound } from "next/navigation";

interface TrackPageProps {
    params: Promise<{ id: string }>;
}

export function generateStaticParams() {
    return getAllTracks().map((track) => ({
        id: track.id,
    }));
}

export default async function TrackPage({ params }: TrackPageProps) {
    const { id } = await params;

    const track = getTrackById(id);

    if (!track) notFound();

    return (
        <div className="mx-auto max-w-3xl px-6 py-10">
            {/* Back link */}
            <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors mb-8 inline-block"
            >
                ← Back to library
            </Link>

            {/* Header */}
            <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">
                    <Link
                        href={`/expansion/${expansionToSlug(track.expansion)}`}
                        className="hover:text-primary transition-colors"
                    >
                        {track.expansion}
                    </Link>
                </p>
                <h1 className="text-3xl font-bold tracking-tight">
                    {track.title}
                </h1>
                {track.composer && (
                    <p className="text-muted-foreground mt-1">
                        {track.composer}
                    </p>
                )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-8">
                {track.mood.map((m) => (
                    <Badge key={m} variant="secondary" className="capitalize">
                        {m}
                    </Badge>
                ))}
                {track.tags.map((t) => (
                    <Badge key={t} variant="outline" className="capitalize">
                        {t}
                    </Badge>
                ))}
            </div>

            {/* Play button — client component */}
            <TrackPlayButton track={track} />

            {/* Description */}
            {track.description && (
                <p className="text-muted-foreground mt-8 leading-relaxed">
                    {track.description}
                </p>
            )}
        </div>
    );
}
