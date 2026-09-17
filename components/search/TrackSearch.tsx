import { usePlayerStore } from "@/hooks/usePlayerStore";
import { Track } from "@/types/track";
import { Badge } from "../ui/badge";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useEffect, useState } from "react";

interface TrackSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TrackSearch({ open, onOpenChange }: TrackSearchProps) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Track[]>([]);

  useEffect(() => {
    // Nothing to fetch for an empty query — the render below already shows
    // no results in that case, so the effect has no work to do at all.
    if (!query.trim()) return;

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/tracks?q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal },
        );

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setResults(data);
      } catch (error) {
        const isAbort =
          error instanceof DOMException && error.name === "AbortError";
        if (!isAbort) {
          console.error("Track search failed:", error);
        }
      }
    }, 300);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  // Derived, not stored: an empty query always shows no results, even if
  // `results` still holds data from a previous, now-cleared search.
  const displayedResults = query.trim() ? results : [];

  const play = usePlayerStore((s) => s.play);

  function handleSelect(track: Track) {
    play(track);
    onOpenChange(false);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command shouldFilter={false}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search tracks, expansions, composers..."
        />
        <CommandList>
          <CommandEmpty>No tracks found.</CommandEmpty>
          <CommandGroup heading="Tracks">
            {displayedResults.map((track) => (
              <CommandItem
                key={track.id}
                value={`${track.title} ${track.expansion} ${track.composer}`}
                onSelect={() => handleSelect(track)}
                className="flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{track.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {track.expansion}
                    {track.composer && ` · ${track.composer}`}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs capitalize shrink-0"
                >
                  {track.mood[0]}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
