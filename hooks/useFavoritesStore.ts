import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
    /** Track ids the user has favorited, in the order they were added. */
    favoriteIds: string[];
    /** True once the store has read localStorage on the client. */
    hasHydrated: boolean;
    toggleFavorite: (trackId: string) => void;
    isFavorited: (trackId: string) => boolean;
    setHasHydrated: (value: boolean) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favoriteIds: [],
            hasHydrated: false,

            toggleFavorite: (trackId) =>
                set((state) => ({
                    favoriteIds: state.favoriteIds.includes(trackId)
                        ? state.favoriteIds.filter((id) => id !== trackId)
                        : [...state.favoriteIds, trackId],
                })),

            isFavorited: (trackId) => get().favoriteIds.includes(trackId),

            setHasHydrated: (value) => set({ hasHydrated: value }),
        }),
        {
            name: "d2-music:favorites",
            // Only persist the data, not the actions or the hydration flag.
            partialize: (state) => ({ favoriteIds: state.favoriteIds }),
            // Do not read localStorage during the initial render. The server
            // has no localStorage, so reading it eagerly would make the first
            // client render differ from the server HTML (hydration mismatch).
            // FavoritesHydrator calls rehydrate() after mount instead.
            skipHydration: true,
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        },
    ),
);
