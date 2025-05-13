import { create } from "zustand";

interface PerfAreaState {
  perfArea: string;
  setPerfArea: (area: string) => void;
}

export const useCurrentPerfArea = create<PerfAreaState>((set) => ({
  perfArea: "start",
  setPerfArea: (area) => set({ perfArea: area }),
}));
