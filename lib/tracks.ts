import tracks from "@/data/tracks.json";
import { Expansion, Mood, Tag, Track } from "@/types/track";

const allTracks = tracks as Track[];

export function getAllTracks(): Track[] {
    return allTracks;
}

export function getTrackById(id: string): Track | undefined {
    return allTracks.find((track) => track.id === id);
}

export function getTracksByExpansion(slug: string): Track[] {
    return allTracks.filter(
        (track) => track.expansion.toLowerCase().replace(/\s+/g, "-") === slug,
    );
}

export function getTracksByMood(mood: string): Track[] {
    return allTracks.filter((track) => track.mood.includes(mood as Mood));
}

export function getTracksByTag(tag: string): Track[] {
    return allTracks.filter((track) => track.tags.includes(tag as Tag));
}

export function getAllExpansions(): Expansion[] {
    return [...new Set(allTracks.map((track) => track.expansion))];
}

export function getAllMoods(): Mood[] {
    return [...new Set(allTracks.flatMap((t) => t.mood))];
}

export function searchTracks(query: string): Track[] {
    const q = query.toLowerCase();
    return allTracks.filter(
        (t) =>
            t.title.toLowerCase().includes(q) ||
            t.expansion.toLowerCase().includes(q) ||
            t.composer?.toLowerCase().includes(q),
    );
}

export function expansionToSlug(expansion: Expansion): string {
    return expansion.toLowerCase().replace(/\s+/g, "-");
}
