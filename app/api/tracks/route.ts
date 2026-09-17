import { searchTracks } from "@/lib/tracks";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const tracks = searchTracks(q);

  return Response.json(tracks);
}
