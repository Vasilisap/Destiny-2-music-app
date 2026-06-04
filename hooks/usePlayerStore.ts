import type { Track } from "@/types/track";
import { create } from "zustand";

interface PlayerState {
    currentTrack: Track | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    seekTarget: number | null;
    play: (track: Track) => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    seek: (time: number) => void;
    clearSeek: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    seekTarget: null,

    play: (track) => set({ currentTrack: track, isPlaying: true, currentTime: 0, duration: 0, seekTarget: null }),
    pause: () => set({ isPlaying: false }),
    resume: () => set({ isPlaying: true }),
    stop: () => set({ currentTrack: null, isPlaying: false, currentTime: 0, duration: 0, seekTarget: null }),
    setCurrentTime: (time) => set({ currentTime: time }),
    setDuration: (duration) => set({ duration }),
    seek: (time) => set({ seekTarget: time }),
    clearSeek: () => set({ seekTarget: null }),
}));
