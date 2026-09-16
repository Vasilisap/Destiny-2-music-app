import { Expansion, Mood } from "@/types/track";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { expansionToSlug } from "@/lib/tracks";
import Link from "next/link";

interface TrackFilterProps {
  expansions: Expansion[];
  moods: Mood[];
  selectedExpansion: string | undefined;
  selectedMood: string | undefined;
}

function buildFilterHref(
  expansion: string | undefined,
  mood: string | undefined,
) {
  const params = new URLSearchParams();
  if (expansion) params.set("expansion", expansion);
  if (mood) params.set("mood", mood);
  const queryString = params.toString();
  return queryString ? `/?${queryString}` : "/";
}

export default function TrackFilters({
  expansions,
  moods,
  selectedExpansion,
  selectedMood,
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
              <Link
                href={buildFilterHref(
                  expansion === selectedExpansion ? undefined : expansion,
                  selectedMood,
                )}
              >
                <Badge
                  variant={
                    selectedExpansion === expansion ? "default" : "outline"
                  }
                  className="cursor-pointer capitalize"
                >
                  {expansion}
                </Badge>
              </Link>

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
              <Link
                href={buildFilterHref(
                  selectedExpansion,
                  mood === selectedMood ? undefined : mood,
                )}
              >
                <Badge
                  variant={selectedMood === mood ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                >
                  {mood}
                </Badge>
              </Link>

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
          asChild
          variant="ghost"
          size="sm"
          className="self-start text-muted-foreground"
        >
          <Link href="/">Clear filters</Link>
        </Button>
      )}
    </div>
  );
}
