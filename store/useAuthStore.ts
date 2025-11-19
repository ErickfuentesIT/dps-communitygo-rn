// store/useAuthStore.ts
import { UserProfile } from "@/types/User";
import { create } from "zustand";
import { tokenStorage } from "./../utils/tokenStorage";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: true }),

  logout: async () => {
    await tokenStorage.clearTokens(); // Borra tokens físicos
    set({ user: null, isAuthenticated: false }); // Borra estado en memoria
  },
}));
