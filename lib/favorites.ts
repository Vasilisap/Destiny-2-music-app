import "server-only";
import { db } from "@/lib/db";

export function getFavoriteTrackIds(): string[] {
    const rows = db.prepare("SELECT track_id FROM favorites").all() as {
        track_id: string;
    }[];

    return rows.map((row) => row.track_id);
}
