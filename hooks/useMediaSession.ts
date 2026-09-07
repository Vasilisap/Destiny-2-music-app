import { useEffect } from "react";
import { usePlayerStore } from "./usePlayerStore";

export default function useMediaSession() {
  const { currentTrack, isPlaying, play, pause, resume } = usePlayerStore();

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    if (!currentTrack) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.composer ?? "Unknown Artist",
      album: currentTrack.expansion,
    });

    // Register controls
    navigator.mediaSession.setActionHandler("play", () => resume());
    navigator.mediaSession.setActionHandler("pause", () => pause());

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
    };
  }, [currentTrack, isPlaying, play, pause, resume]);
}
