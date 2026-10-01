import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StationId } from "@/lib/course-data";

export type View = "home" | StationId;

type CourseState = {
  view: View;
  seen: StationId[];
  bestScore: number;
  attempts: number;
  setView: (view: View) => void;
  markSeen: (id: StationId) => void;
  recordScore: (score: number) => void;
  resetProgress: () => void;
};

export const useCourse = create<CourseState>()(
  persist(
    (set) => ({
      view: "home",
      seen: [],
      bestScore: 0,
      attempts: 0,
      setView: (view) => set({ view }),
      markSeen: (id) =>
        set((state) => ({
          seen: state.seen.includes(id) ? state.seen : [...state.seen, id],
        })),
      recordScore: (score) =>
        set((state) => ({
          bestScore: Math.max(state.bestScore, score),
          attempts: state.attempts + 1,
        })),
      resetProgress: () => set({ seen: [], bestScore: 0, attempts: 0, view: "home" }),
    }),
    {
      name: "atomarium-course",
      skipHydration: true,
      partialize: (state) => ({
        seen: state.seen,
        bestScore: state.bestScore,
        attempts: state.attempts,
      }),
    },
  ),
);
