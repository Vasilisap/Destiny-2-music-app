"use client";

import { useFavoritesStore } from "@/hooks/useFavoritesStore";
import { useEffect } from "react";

/**
 * Reads favorites from localStorage once the app has mounted in the browser.
 * Rendered once in the root layout so every page gets hydrated favorites.
 */
export default function FavoritesHydrator() {
    useEffect(() => {
        useFavoritesStore.persist.rehydrate();
    }, []);

    return null;
}
