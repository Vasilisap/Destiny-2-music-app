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

  queue: Track[]; // the order being played (shuffled or not)
  originalQueue: Track[]; // the order the user started from
  queueIndex: number; // position in `queue`; -1 when empty
  shuffle: boolean;

  playFromQueue: (tracks: Track[], startIndex: number) => void;
  next: () => void;
  previous: () => void;
  toggleShuffle: () => void;
  hasNext: () => boolean;
}
function startTrack(track: Track) {
  return {
    currentTrack: track,
    isPlaying: true,
    currentTime: 0,
    duration: 0,
    seekTarget: null,
  };
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function shuffleAround(tracks: Track[], current: Track): Track[] {
  const rest = tracks.filter((t) => t.id !== current.id);
  return [current, ...shuffleArray(rest)];
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  seekTarget: null,

  play: (track) =>
    set({
      queue: [track],
      originalQueue: [track],
      queueIndex: 0,
      ...startTrack(track),
    }),
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  stop: () =>
    set({
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      seekTarget: null,
      queueIndex: -1,
      queue: [],
      originalQueue: [],
    }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  seek: (time) => set({ seekTarget: time }),
  clearSeek: () => set({ seekTarget: null }),

  queue: [],
  originalQueue: [],
  queueIndex: -1,
  shuffle: false,

  playFromQueue: (tracks, startIndex) => {
    const track = tracks[startIndex];
    if (!track) return;

    set((state) => ({
      originalQueue: [...tracks],
      queue: state.shuffle ? shuffleAround(tracks, track) : [...tracks],
      queueIndex: state.shuffle ? 0 : startIndex,
      ...startTrack(track),
    }));
  },

  next: () =>
    set((state) => {
      if (state.queueIndex < 0) return {};

      const nextIndex =
        state.queueIndex === state.queue.length - 1 ? 0 : state.queueIndex + 1;

      return {
        queueIndex: nextIndex,
        ...startTrack(state.queue[nextIndex]),
      };
    }),

  previous: () =>
    set((state) => {
      if (state.queueIndex < 0) return {};

      //   More than 3s in: restart the current track instead of going back
      if (state.currentTime > 3) return { currentTime: 0, seekTarget: 0 };

      const prevIndex =
        state.queueIndex === 0 ? state.queue.length - 1 : state.queueIndex - 1;

      return {
        queueIndex: prevIndex,
        ...startTrack(state.queue[prevIndex]),
      };
    }),

  toggleShuffle: () =>
    set((state) => {
      if (state.queueIndex < 0) return { shuffle: !state.shuffle };
      const current = state.queue[state.queueIndex];

      if (!state.shuffle) {
        const queue = shuffleAround(state.originalQueue, current);
        return { shuffle: true, queue, queueIndex: 0 };
      } else {
        const index = state.originalQueue.findIndex((t) => t.id === current.id);
        return {
          shuffle: false,
          queue: state.originalQueue,
          queueIndex: index,
        };
      }
    }),

  hasNext: () => {
    const { queue, queueIndex } = get();

    return queueIndex >= 0 && queueIndex < queue.length - 1;
  },
}));
