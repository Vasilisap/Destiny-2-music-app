import TrackGrid from "@/components/track/TrackGrid";
import {
    expansionToSlug,
    getAllExpansions,
    getTracksByExpansion,
} from "@/lib/tracks";
import { notFound } from "next/navigation";

interface ExpansionPageProps {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return getAllExpansions().map((expansion) => ({
        slug: expansionToSlug(expansion),
    }));
}

export default async function page({ params }: ExpansionPageProps) {
    const { slug } = await params;

    const tracks = getTracksByExpansion(slug);

    if (tracks.length === 0) notFound();

    const expansionName = tracks[0].expansion;

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            {/* Header */}
            <div className="mb-8">
                <p className="text-sm text-muted-foreground mb-1">Expansion</p>
                <h1 className="text-3xl font-bold tracking-tight">
                    {expansionName}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {tracks.length} tracks
                </p>
            </div>

            <TrackGrid tracks={tracks} />
        </div>
    );
}
