"use client";

import { useState } from "react";
import { usePlayerStore } from "@/hooks/usePlayerStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerBar() {
    const { currentTrack, isPlaying, currentTime, duration, pause, resume, stop, seek } =
        usePlayerStore();

    const [isDragging, setIsDragging] = useState(false);
    const [dragValue, setDragValue] = useState(0);

    if (!currentTrack) return null;

    const displayTime = isDragging ? dragValue : currentTime;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-3">
                {/* Track info + controls */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">
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
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={isPlaying ? pause : resume}
                        >
                            {isPlaying ? "⏸ Pause" : "▶ Resume"}
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

                {/* Seek bar */}
                <div className="flex items-center gap-3">
                    <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
                        {formatTime(displayTime)}
                    </span>
                    <Slider
                        value={[displayTime]}
                        min={0}
                        max={duration || 100}
                        step={1}
                        className="flex-1"
                        onValueChange={([value]) => {
                            setIsDragging(true);
                            setDragValue(value);
                        }}
                        onValueCommit={([value]) => {
                            seek(value);
                            setIsDragging(false);
                        }}
                    />
                    <span className="w-10 text-xs tabular-nums text-muted-foreground">
                        {formatTime(duration)}
                    </span>
                </div>
            </div>
        </div>
    );
}
