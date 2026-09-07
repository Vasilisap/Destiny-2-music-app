"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/lib/actions";

interface FavoriteButtonProps {
    trackId: string;
    initialFavorited: boolean;
}

export default function FavoriteButton({
    trackId,
    initialFavorited,
}: FavoriteButtonProps) {
    const [, startTransition] = useTransition();
    const [isFavorited, setIsFavorited] = useOptimistic(initialFavorited);

    function handleClick() {
        startTransition(async () => {
            setIsFavorited(!isFavorited);
            await toggleFavorite(trackId);
        });
    }

    return (
        <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleClick}
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
