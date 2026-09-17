"use client";

import { usePlayerStore } from "@/hooks/usePlayerStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SeekBar } from "./SeekBar";
import { expansionAccent } from "@/lib/utils";
import { Shuffle, SkipBack, SkipForward } from "lucide-react";

export function PlayerBar() {
    // Selectors, not a bulk destructure: this component must not re-render
    // on the currentTime ticks that SeekBar subscribes to on its own.
    const currentTrack = usePlayerStore((s) => s.currentTrack);
    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const shuffle = usePlayerStore((s) => s.shuffle);
    const pause = usePlayerStore((s) => s.pause);
    const resume = usePlayerStore((s) => s.resume);
    const stop = usePlayerStore((s) => s.stop);
    const next = usePlayerStore((s) => s.next);
    const previous = usePlayerStore((s) => s.previous);
    const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);

    // next()/previous() wrap the queue rather than stop at the ends (that
    // "stop at the end" rule only applies to autoplay in YoutubePlayer's
    // onEnd handler), so there is no "nowhere to go" state to disable for
    // here — with a single-track queue this simply points back at itself,
    // which matches what pressing the button actually does.
    const upNextTrack = usePlayerStore((s) =>
        s.queue.length > 0 ? s.queue[(s.queueIndex + 1) % s.queue.length] : undefined,
    );

    if (!currentTrack) return null;

    function handlePlayPause() {
        if (isPlaying) {
            pause();
        } else {
            resume();
        }
    }

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-[0_-1px_0_var(--border),0_-12px_24px_-12px_oklch(0.78_0.15_75/15%)]"
        >
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-3">
                {/* Track info + controls */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <span
                            className="hidden sm:block h-8 w-1 shrink-0 rounded-full"
                            style={{ backgroundColor: expansionAccent(currentTrack.expansion) }}
                            aria-hidden
                        />
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="font-heading text-sm font-semibold truncate">
                                {currentTrack.title}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                    {currentTrack.expansion}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                    {currentTrack.mood[0]}
                                </Badge>
                            </div>
                            {upNextTrack && (
                                <span className="text-xs text-muted-foreground truncate">
                                    Up next: {upNextTrack.title}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={toggleShuffle}
                            aria-label={
                                shuffle ? "Turn shuffle off" : "Turn shuffle on"
                            }
                            aria-pressed={shuffle}
                        >
                            <Shuffle className={shuffle ? "text-primary" : ""} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={previous}
                            aria-label="Previous track"
                        >
                            <SkipBack />
                        </Button>
                        <Button
                            variant={isPlaying ? "default" : "outline"}
                            size="sm"
                            className={isPlaying ? "shadow-sm shadow-primary/30" : ""}
                            onClick={handlePlayPause}
                        >
                            {isPlaying ? "⏸ Pause" : "▶ Resume"}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={next}
                            aria-label="Next track"
                        >
                            <SkipForward />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={stop}
                            aria-label="Stop"
                        >
                            ✕
                        </Button>
                    </div>
                </div>

                <SeekBar />
            </div>
        </div>
    );
}
