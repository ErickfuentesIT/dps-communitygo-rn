// store/useAuthStore.ts
import { UserProfile } from "@/types/User";
import { create } from "zustand";
import { tokenStorage } from "./../utils/tokenStorage";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  userId: string | null; // ✅ NUEVO: Acceso directo al ID para filtrado
  setUser: (user: UserProfile) => void;
  logout: () => void;
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
