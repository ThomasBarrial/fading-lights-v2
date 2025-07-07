// store/usePlatformStore.ts
import { create } from "zustand";

type PlatformStore = {
  platformVelocityX: number;
  setPlatformVelocityX: (vx: number) => void;
};

export const usePlatformStore = create<PlatformStore>((set) => ({
  platformVelocityX: 0,
  setPlatformVelocityX: (vx) => set({ platformVelocityX: vx }),
}));
