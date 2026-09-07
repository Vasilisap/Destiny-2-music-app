"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(trackId: string): Promise<void> {
    const existing = db
        .prepare("SELECT 1 FROM favorites WHERE track_id = ?")
        .get(trackId);

    if (existing) {
        db.prepare("DELETE FROM favorites WHERE track_id = ?").run(trackId);
    } else {
        db.prepare(
            "INSERT INTO favorites (track_id, created_at) VALUES (?, ?)",
        ).run(trackId, Date.now());
    }

    // Favorite status can appear on the home grid, expansion/mood pages,
    // the track detail page, and /favorites — revalidate the whole tree
    // in one call rather than enumerating every route.
    revalidatePath("/", "layout");
}
