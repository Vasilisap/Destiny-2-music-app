export type Expansion =
    | "Red War"
    | "Forsaken"
    | "Shadowkeep"
    | "Beyond Light"
    | "Witch Queen"
    | "Lightfall"
    | "The Final Shape";

export type Tag =
    | "ambient"
    | "combat"
    | "boss"
    | "cutscene"
    | "patrol"
    | "social"
    | "strike"
    | "raid";

export type Mood =
    | "epic"
    | "melancholic"
    | "mysterious"
    | "triumphant"
    | "tense"
    | "peaceful";

export interface Track {
    id: string;
    title: string;
    expansion: Expansion;
    youtubeId: string;
    tags: Tag[];
    mood: Mood[];
    composer?: string;
    duration?: number; // seconds
    description?: string; // optional flavour text
}
