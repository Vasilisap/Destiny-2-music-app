"use client";

import useMediaSession from "@/hooks/useMediaSession";
import { usePlayerStore } from "@/hooks/usePlayerStore";
import { useEffect, useRef } from "react";
import YouTube, { YouTubePlayer as YTPlayer } from "react-youtube";

export default function YoutubePlayer() {
  useMediaSession();

  // One selector per value so this component only re-renders when the
  // thing it actually reads changes, not on every currentTime tick.
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const seekTarget = usePlayerStore((s) => s.seekTarget);
  const pause = usePlayerStore((s) => s.pause);
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const clearSeek = usePlayerStore((s) => s.clearSeek);
  const hasNext = usePlayerStore((s) => s.hasNext);
  const next = usePlayerStore((s) => s.next);

  const playerRef = useRef<YTPlayer | null>(null);
  const isReadyRef = useRef(false);

  // Mark the player "not ready" the instant the track changes, so nothing
  // calls a method while react-youtube is mid-reload for the new video.
  // onReady fires again once the reload completes (see comment on `key`
  // below) and flips this back on with the fresh player reference.
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

  // Shared by onEnd and onError: move on if the queue has more, otherwise stop.
  function advanceOrPause() {
    if (hasNext()) {
      next();
    } else {
      pause();
    }
  }

  if (!currentTrack) return null;

  return (
    <div
      style={{ position: "fixed", top: "-9999px", left: "-9999px" }}
      aria-hidden
    >
      <YouTube
        // No `key` here on purpose. Keying by track forced React to
        // destroy this whole component and mount a fresh one on every
        // track change — two independent, uncoordinated player lifecycles
        // (old one still tearing down async while a new one starts up)
        // racing each other, which is what threw "Cannot read properties
        // of null (reading 'playVideo')" under rapid Next/Shuffle clicks.
        // react-youtube already reacts to a changed `videoId` prop on its
        // own: it destroys and rebuilds its internal player, but does so
        // as one promise chain inside a single component instance, so
        // there's never a moment with two competing player instances.
        // onReady fires again after that reload, same as a fresh mount.
        videoId={currentTrack.youtubeId}
        onReady={(e) => {
          playerRef.current = e.target;
          isReadyRef.current = true;
          setDuration(e.target.getDuration());

          if (isPlaying) {
            e.target.playVideo();
          }
        }}
        onEnd={advanceOrPause}
        onError={(e) => {
          console.warn(
            "YouTube playback failed for:",
            currentTrack?.youtubeId,
            "— error code:",
            e.data,
          );
          advanceOrPause();
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
