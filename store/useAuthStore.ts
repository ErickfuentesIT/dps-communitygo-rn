// store/useAuthStore.ts
import { UserProfile } from "@/types/User";
import { tokenStorage } from "@/utils/tokenStorage";
import { create } from "zustand";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  userId: string | null;
  setUser: (user: UserProfile) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  userId: null, // ✅ Inicializamos el ID como nulo

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      userId: user.id, // ✅ Asignamos el ID del perfil aquí
    }),

  logout: async () => {
    await tokenStorage.clearTokens(); // Borra tokens físicos
    set({
      user: null,
      isAuthenticated: false,
      userId: null, // ✅ Limpiamos el ID al hacer logout
    });
  },
}));
