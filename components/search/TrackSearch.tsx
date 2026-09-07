import { usePlayerStore } from "@/hooks/usePlayerStore";
import { getAllTracks } from "@/lib/tracks";
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

const allTracks = getAllTracks();

interface TrackSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TrackSearch({ open, onOpenChange }: TrackSearchProps) {
  const play = usePlayerStore((s) => s.play);

  function handleSelect(track: Track) {
    play(track);
    onOpenChange(false);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="Search tracks, expansions, composers..." />
        <CommandList>
          <CommandEmpty>No tracks found.</CommandEmpty>
          <CommandGroup heading="Tracks">
            {allTracks.map((track) => (
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
