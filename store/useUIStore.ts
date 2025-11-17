import { create } from "zustand";

interface FabState {
  isFabExtended: boolean;
  setFabExtended: (isExtended: boolean) => void;
  isCreatingEvent: boolean;
  setIsCreatingEvent: (isCreating: boolean) => void;
}

export const useUIStore = create<FabState>((set) => ({
  isFabExtended: true,
  setFabExtended: (isFabExtended) => set({ isFabExtended }),
  isCreatingEvent: false,
  setIsCreatingEvent: (isCreatingEvent) => set({ isCreatingEvent }),
}));
