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
  // True once the one, permanent player object exists and can receive
  // commands. Never goes false again after that — see the long comment
  // on <YouTube> below for why there is no more "player is mid-reset".
  const isReadyRef = useRef(false);
  // The video currently loaded into the player, so a redundant load isn't
  // requested when this effect re-runs for an unrelated reason (e.g. an
  // isPlaying change on the same track).
  const loadedYoutubeIdRef = useRef<string | undefined>(undefined);

  // Load whatever track the store currently wants onto the existing
  // player. Safe to call as often as needed — loadVideoById/cueVideoById
  // swapping videos on a live player is exactly the playlist use case the
  // IFrame API is built for, unlike destroying and recreating the player
  // (see <YouTube> below), so there's no "busy" state to coordinate here.
  useEffect(() => {
    const desired = currentTrack?.youtubeId;
    if (!playerRef.current || !isReadyRef.current) return;
    if (desired === undefined || desired === loadedYoutubeIdRef.current) return;

    loadedYoutubeIdRef.current = desired;
    try {
      if (isPlaying) {
        playerRef.current.loadVideoById({ videoId: desired });
      } else {
        playerRef.current.cueVideoById({ videoId: desired });
      }
    } catch (e) {
      console.warn("Failed to load track into player:", e);
    }
  }, [currentTrack?.youtubeId, isPlaying]);

  // Play / pause in response to store state, for a track that's already
  // loaded (the effect above handles switching to a different track).
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
        // videoId is fixed at undefined, permanently — never bound to
        // currentTrack. This player is created exactly once and never
        // torn down again.
        //
        // The earlier design instead kept videoId in sync with the
        // current track, relying on react-youtube's own reaction to a
        // changed videoId prop: it destroys the whole underlying player
        // and builds a new one (this is also why an even earlier version
        // additionally forced a React remount via `key` — removed for a
        // different bug, see git history). That destroy-then-recreate
        // path goes through a promise chain in a third-party library two
        // layers down (youtube-player's own destroy/create sequencing),
        // and it does not reliably complete for a player that was
        // actively playing when asked to reset — confirmed by tracing an
        // actual session where the destroy step never resolved and the
        // player was stuck for good, no crash, no timeout, nothing to
        // catch.
        //
        // loadVideoById/cueVideoById below are the officially supported
        // way to change what a single, already-created player is showing,
        // and they don't go through that destroy/create sequence at all,
        // so every track change after the first now avoids it entirely.
        videoId={undefined}
        onReady={(e) => {
          playerRef.current = e.target;
          isReadyRef.current = true;
          // A track may already have been requested before this one-time
          // ready event fired (e.g. the very first Play click). Load it
          // now instead of waiting for a currentTrack change that has
          // already happened.
          if (currentTrack) {
            loadedYoutubeIdRef.current = currentTrack.youtubeId;
            if (isPlaying) {
              e.target.loadVideoById({ videoId: currentTrack.youtubeId });
            } else {
              e.target.cueVideoById({ videoId: currentTrack.youtubeId });
            }
          }
        }}
        onStateChange={() => {
          // Duration isn't known until the video has actually loaded, and
          // onReady only ever fires once (for the empty player), so pick
          // it up here instead, once per track once it becomes available.
          if (playerRef.current) {
            setDuration(playerRef.current.getDuration());
          }
        }}
        onEnd={() => {
          if (hasNext()) {
            next();
          } else {
            pause();
          }
        }}
        onError={(e) => {
          console.warn(
            "YouTube playback failed for:",
            currentTrack?.youtubeId,
            "— error code:",
            e.data,
          );

          if (hasNext()) {
            next();
          } else {
            pause();
          }
        }}
        opts={{
          playerVars: {
            // Deliberately NOT 1. Native autoplay is applied unconditionally
            // once a video is ready, with no way to cancel it. Playback is
            // driven entirely by isPlaying instead — loadVideoById above
            // already autoplays when isPlaying is true, and cueVideoById
            // loads without playing when it's false.
            autoplay: 0,
            controls: 0,
            origin: typeof window !== "undefined" ? window.location.origin : "",
          },
        }}
      />
    </div>
  );
}
