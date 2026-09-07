"use client";

import useMediaSession from "@/hooks/useMediaSession";
import { usePlayerStore } from "@/hooks/usePlayerStore";
import { useEffect, useRef } from "react";
import YouTube, { YouTubePlayer as YTPlayer } from "react-youtube";

export default function YoutubePlayer() {
  useMediaSession();
  const {
    currentTrack,
    isPlaying,
    seekTarget,
    pause,
    setCurrentTime,
    setDuration,
    clearSeek,
  } = usePlayerStore();

  const playerRef = useRef<YTPlayer | null>(null);
  const isReadyRef = useRef(false);

  // Reset refs when track changes so stale player is never called
  useEffect(() => {
    isReadyRef.current = false;
    playerRef.current = null;
  }, [currentTrack?.id]);

  // Play / pause in response to store state
  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (e) {
      console.warn("Player not ready yet:", e);
    }
  }, [isPlaying]);

  // Seek when PlayerBar slider is committed
  useEffect(() => {
    if (seekTarget === null || !playerRef.current || !isReadyRef.current)
      return;
    playerRef.current.seekTo(seekTarget, true);
    clearSeek();
  }, [seekTarget, clearSeek]);

  // Poll current time every 500ms while playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (playerRef.current && isReadyRef.current) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying, setCurrentTime]);

  if (!currentTrack) return null;

  return (
    <div
      style={{ position: "fixed", top: "-9999px", left: "-9999px" }}
      aria-hidden
    >
      <YouTube
        key={currentTrack.id}
        videoId={currentTrack.youtubeId}
        onReady={(e) => {
          playerRef.current = e.target;
          isReadyRef.current = true;
          setDuration(e.target.getDuration());

          if (isPlaying) {
            e.target.playVideo();
          }
        }}
        onEnd={() => pause()}
        onError={(e) => {
          console.warn(
            "YouTube playback failed for:",
            currentTrack?.youtubeId,
            "— error code:",
            e.data,
          );
          pause();
        }}
        opts={{
          playerVars: {
            autoplay: 1,
            controls: 0,
            origin: typeof window !== "undefined" ? window.location.origin : "",
          },
        }}
      />
    </div>
  );
}
