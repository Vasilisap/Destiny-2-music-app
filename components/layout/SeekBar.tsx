"use client";

import { useState } from "react";
import { usePlayerStore } from "@/hooks/usePlayerStore";
import { Slider } from "@/components/ui/slider";

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Owns everything that changes on every currentTime tick, so the rest of
 * PlayerBar (title, badges, transport buttons) never re-renders for it.
 */
export function SeekBar() {
    const currentTime = usePlayerStore((s) => s.currentTime);
    const duration = usePlayerStore((s) => s.duration);
    const seek = usePlayerStore((s) => s.seek);

    const [isDragging, setIsDragging] = useState(false);
    const [dragValue, setDragValue] = useState(0);

    const displayTime = isDragging ? dragValue : currentTime;

    return (
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
    );
}
