import TrackGrid from "@/components/track/TrackGrid";
import { getAllMoods, getTracksByMood } from "@/lib/tracks";
import { notFound } from "next/navigation";

interface MoodPageProps {
  params: Promise<{ mood: string }>;
}

export function generateStaticParams() {
  return getAllMoods().map((mood) => ({
    mood: mood,
  }));
}

export default async function MoodPage({ params }: MoodPageProps) {
  const { mood } = await params;

  const tracks = getTracksByMood(mood);

  if (!tracks || tracks.length === 0) notFound();

  const moodName = mood.charAt(0).toUpperCase() + mood.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-muted-foreground mb-1">Mood</p>
        <h1 className="text-3xl font-bold tracking-tight">{moodName}</h1>
        <p className="text-muted-foreground mt-1">{tracks.length} tracks</p>
      </div>

      <TrackGrid tracks={tracks} />
    </div>
  );
}
