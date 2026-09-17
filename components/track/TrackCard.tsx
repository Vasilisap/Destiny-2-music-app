"use client";

import { usePlayerStore } from "@/hooks/usePlayerStore";
import { Track } from "@/types/track";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { expansionAccent } from "@/lib/utils";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

interface TrackCardProps {
  track: Track;
  queue: Track[];
  index: number;
}

export default function TrackCard({ track, queue, index }: TrackCardProps) {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const playFromQueue = usePlayerStore((state) => state.playFromQueue);
  const pause = usePlayerStore((state) => state.pause);
  const resume = usePlayerStore((state) => state.resume);

  const isCurrentTrack = currentTrack?.id === track.id;

  function handleClick() {
    if (isCurrentTrack) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      playFromQueue(queue, index);
    }
  }

  return (
    <div
      className={`
      relative overflow-hidden rounded-lg border bg-card p-4 pl-5 flex flex-col gap-3 transition-all
      hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 cursor-pointer
      ${isCurrentTrack ? "border-primary bg-primary/5" : ""}
    `}
    >
      {/* Per-expansion accent bar — the closest thing to album art this
          catalogue has, since none of the tracks have real cover images. */}
      <span
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: expansionAccent(track.expansion) }}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-2">
        <div>
          <Link href={`/track/${track.id}`}>
            <p className="font-medium text-sm leading-tight hover:text-primary transition-colors">
              {track.title}
            </p>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">
            {track.expansion}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isCurrentTrack && (
            <span className="text-xs text-primary font-medium">
              {isPlaying ? "▶ Playing" : "⏸ Paused"}
            </span>
          )}
          <FavoriteButton trackId={track.id} />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {track.mood.map((m) => (
          <Badge key={m} variant="secondary" className="text-xs capitalize">
            {m}
          </Badge>
        ))}
        {track.tags.map((t) => (
          <Badge key={t} variant="outline" className="text-xs capitalize">
            {t}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        {track.composer && (
          <span className="text-xs text-muted-foreground">
            {track.composer}
          </span>
        )}
        <Button
          size="sm"
          variant={isCurrentTrack ? "default" : "outline"}
          className="ml-auto"
          onClick={handleClick}
        >
          {isCurrentTrack ? (isPlaying ? "Pause" : "Resume") : "Play"}
        </Button>
      </div>
    </div>
  );
}
