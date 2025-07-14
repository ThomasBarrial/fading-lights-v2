// store/usePlatformStore.ts
import { create } from "zustand";

type PlatformStore = {
  platformVelocityX: number;
  setPlatformVelocityX: (vx: number) => void;

  velocityByPlatformHandle: Record<number, number>;
  setPlatformVelocityByHandle: (handle: number, vx: number) => void;
};

export const usePlatformStore = create<PlatformStore>((set) => ({
  platformVelocityX: 0,
  setPlatformVelocityX: (vx) => set({ platformVelocityX: vx }),

  velocityByPlatformHandle: {},
  setPlatformVelocityByHandle: (handle, vx) =>
    set((state) => ({
      velocityByPlatformHandle: {
        ...state.velocityByPlatformHandle,
        [handle]: vx,
      },
    })),
}));
