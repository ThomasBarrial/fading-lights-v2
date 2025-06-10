interface IUseIsMenuOpen {
  isMenuOpen: boolean;
  isControlsOpen: boolean;
  shouldRestartGame: boolean;
  setShouldRestartGame: (value: boolean) => void;
  resetShouldRestartGame: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  openControls: () => void;
  closeControls: () => void;
  toggleControls: () => void;
}
import { create } from "zustand";
export const useIsMenuOpen = create<IUseIsMenuOpen>((set) => ({
  isMenuOpen: false,
  isControlsOpen: false,
  shouldRestartGame: false,
  openMenu: () => set({ isMenuOpen: true }),
  closeMenu: () => set({ isMenuOpen: false }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  openControls: () => set({ isControlsOpen: true }),
  closeControls: () => set({ isControlsOpen: false }),
  setShouldRestartGame: (value: boolean) => set({ shouldRestartGame: value }),
  resetShouldRestartGame: () => set({ shouldRestartGame: false }),
  toggleControls: () =>
    set((state) => ({ isControlsOpen: !state.isControlsOpen })),
}));
