import { create } from "zustand";
interface IsPlayerDiedState {
  isPlayerDiedState: boolean;
  markAsPlayerDied: () => void;
  resetPlayerDied: () => void;
}

export const useIsPlayerDied = create<IsPlayerDiedState>((set) => ({
  isPlayerDiedState: false,
  markAsPlayerDied: () => set({ isPlayerDiedState: true }),
  resetPlayerDied: () => set({ isPlayerDiedState: false }),
}));
