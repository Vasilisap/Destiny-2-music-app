"use client";

import { Expansion, Mood } from "@/types/track";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { expansionToSlug } from "@/lib/tracks";
import Link from "next/link";

interface TrackFilterProps {
  expansions: Expansion[];
  moods: Mood[];
  selectedExpansion: Expansion | null;
  selectedMood: Mood | null;
  onExpansionChange: (expansion: Expansion | null) => void;
  onMoodChange: (mood: Mood | null) => void;
  onClear: () => void;
}

export default function TrackFilters({
  expansions,
  moods,
  selectedExpansion,
  selectedMood,
  onExpansionChange,
  onMoodChange,
  onClear,
}: TrackFilterProps) {
  const hasActiveFilter = selectedExpansion || selectedMood;
  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Expansions */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Expansion
        </p>
        <div className="flex flex-wrap gap-2">
          {expansions.map((expansion) => (
            <div key={expansion} className="flex items-center gap-1">
              <Badge
                variant={
                  selectedExpansion === expansion ? "default" : "outline"
                }
                className="cursor-pointer capitalize"
                onClick={() =>
                  onExpansionChange(
                    selectedExpansion === expansion ? null : expansion,
                  )
                }
              >
                {expansion}
              </Badge>
              <Link
                href={`/expansion/${expansionToSlug(expansion)}`}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Moods */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Mood
        </p>
        <div className="flex flex-wrap gap-2">
          {moods.map((mood) => (
            <div key={mood} className="flex items-center gap-1">
              <Badge
                variant={selectedMood === mood ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() =>
                  onMoodChange(selectedMood === mood ? null : mood)
                }
              >
                {mood}
              </Badge>
              <Link
                href={`/mood/${mood}`}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasActiveFilter && (
        <Button
          variant="ghost"
          size="sm"
          className="self-start text-muted-foreground"
          onClick={onClear}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
