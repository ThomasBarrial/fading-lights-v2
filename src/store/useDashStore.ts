// store/useDashStore.ts
import { create } from "zustand";

interface DashState {
  canDash: boolean;
  dashTime: number;
  dashAvailable: boolean;
  isDashing: boolean;
  triggerDash: () => void;
  updateDash: (delta: number, isBoosted: boolean) => void;
  resetDash: () => void;
}

export const useDashStore = create<DashState>((set, get) => ({
  canDash: true,
  dashTime: 0,
  dashAvailable: true,
  isDashing: false,
  triggerDash: () => {
    if (!get().dashAvailable) return;
    set({ dashAvailable: false, dashTime: 0, isDashing: true });
    setTimeout(() => set({ isDashing: false }), 300); // Trail visible pendant 300ms
  },
  updateDash: (delta, isBoosted) => {
    const currentCooldown = isBoosted ? 1 : 2.5; // Cooldown time in seconds
    const dashTime = get().dashTime + delta;

    if (dashTime >= currentCooldown) {
      set({ dashAvailable: true, dashTime: 0 });
    } else {
      set({ dashTime });
    }
  },
  resetDash: () => {
    set({ dashAvailable: true, dashTime: 0, isDashing: false });
  },
}));
