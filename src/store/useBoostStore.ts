import { create } from "zustand";

interface BoostState {
  boostCount: number;
  corruptionLevel: number; // 0 to 1
  threshold: number; // 0.4 to 0.7 (set once per game)

  isBoosted: boolean;
  boostTimer: number;

  baseSpeed: number;
  baseJump: number;
  baseDash: number;

  boostedSpeed: number;
  boostedJump: number;
  boostedDash: number;

  collectedBoosts: Record<string, boolean>;
  markBoostAsCollected: (id: string) => void;
  resetBoosts: () => void;

  applyBoost: (
    corruptionGain: number,
    durationOverride: number | undefined,
  ) => void;
  updateBoostTimer: (dt: number) => void;
  resetBoost: () => void;
  resetAll: () => void;

  isDeadFromCorruption: boolean;
  markAsDeadFromCorruption: () => void;
}

export const useBoostStore = create<BoostState>((set, get) => ({
  boostCount: 0,
  corruptionLevel: 0,
  threshold: 0.95, // between 0.7 and 0.8

  isBoosted: false,
  boostTimer: 0,

  baseSpeed: 3,
  baseJump: 0.7,
  baseDash: 5,

  boostedSpeed: 4,
  boostedJump: 1.2,
  boostedDash: 10,

  isDeadFromCorruption: false,
  markAsDeadFromCorruption: () => set({ isDeadFromCorruption: true }),

  collectedBoosts: {},

  markBoostAsCollected: (id) =>
    set((state) => ({
      collectedBoosts: { ...state.collectedBoosts, [id]: true },
    })),
  resetBoosts: () => set({ collectedBoosts: {} }),

  applyBoost: (corruptionGain, durationOverride) => {
    console.time("applyBoost");
    const { corruptionLevel, threshold, boostCount } = get();
    const newCorruption = Math.min(corruptionLevel + corruptionGain, 1);

    if (newCorruption >= threshold) {
      set({ isDeadFromCorruption: true });
      return;
    }

    const clamped = Math.min(newCorruption, 1);
    const baseSpeed = 3 - clamped * 1.8;
    const baseJump = 0.7 - clamped * 0.2;
    const baseDash = 5 - clamped * 3;
    const boostedSpeed = 4 - clamped * 2;
    const boostedJump = 1.2 - clamped * 0.3;
    const boostedDash = 10 - clamped * 5;

    set({
      boostCount: boostCount + 1,
      corruptionLevel: newCorruption,
      isBoosted: true,
      boostTimer: durationOverride ?? 8 - boostCount, // 👈 si durée fournie, on l’utilise
      baseSpeed,
      baseJump,
      baseDash,
      boostedSpeed,
      boostedJump,
      boostedDash,
    });
    console.timeEnd("applyBoost");
  },

  updateBoostTimer: (dt) => {
    const { boostTimer } = get();
    if (boostTimer > 0) {
      set({ boostTimer: boostTimer - dt });
      if (boostTimer - dt <= 0) {
        set({ isBoosted: false });
      }
    }
  },

  resetBoost: () => set({ isBoosted: false, boostTimer: 0 }),

  resetAll: () =>
    set({
      boostCount: 0,
      corruptionLevel: 0,
      threshold: Math.random() * 0.3 + 0.4,
      isBoosted: false,
      boostTimer: 0,
      baseSpeed: 3,
      baseJump: 0.35,
      baseDash: 5,
      isDeadFromCorruption: false,
    }),
}));
