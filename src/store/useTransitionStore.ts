// stores/useTransitionStore.ts
import { create } from "zustand";

interface TransitionState {
  isTransitioning: boolean;
  startTransition: () => void;
  endTransition: () => void;
  curentLevel: number;
  setCurrentLevel: (level: number) => void;
}

export const useTransitionStore = create<TransitionState>((set) => ({
  isTransitioning: false,
  startTransition: () => set({ isTransitioning: true }),
  endTransition: () => set({ isTransitioning: false }),
  curentLevel: 1, // Niveau par défaut
  setCurrentLevel: (level: number) => set({ curentLevel: level }),
}));
