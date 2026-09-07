"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavoritesStore } from "@/hooks/useFavoritesStore";

interface FavoriteButtonProps {
    trackId: string;
}

export default function FavoriteButton({ trackId }: FavoriteButtonProps) {
    // Select only what this button needs so it re-renders only when
    // this track's favorite status changes, not on every store update.
    const isFavorited = useFavoritesStore((state) =>
        state.favoriteIds.includes(trackId),
    );
    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

    return (
        <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => toggleFavorite(trackId)}
            aria-label={
                isFavorited ? "Remove from favorites" : "Add to favorites"
            }
            aria-pressed={isFavorited}
        >
            <Heart
                className={isFavorited ? "fill-primary text-primary" : ""}
            />
        </Button>
    );
}
