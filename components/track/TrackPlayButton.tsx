"use client";

import { usePlayerStore } from "@/hooks/usePlayerStore";
import { Track } from "@/types/track";
import { Button } from "@/components/ui/button";

export default function TrackPlayButton({ track }: { track: Track }) {
    const { currentTrack, isPlaying, play, pause, resume } = usePlayerStore();

    const isCurrentTrack = currentTrack?.id === track.id;

    function handleClick() {
        if (isCurrentTrack) {
            isPlaying ? pause() : resume();
        } else {
            play(track);
        }
    }

    return (
        <Button size="lg" onClick={handleClick}>
            {isCurrentTrack
                ? isPlaying
                    ? "⏸ Pause"
                    : "▶ Resume"
                : "▶ Play this track"}
        </Button>
    );
}
