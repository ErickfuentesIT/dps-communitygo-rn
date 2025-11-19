// hooks/useAuth.ts
import { useAuthStore } from "@/store/useAuthStore";
import { UserProfile } from "@/types/User";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import client from "./../utils/client";
import { tokenStorage } from "./../utils/tokenStorage";

// Tipado de la respuesta que mostraste
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: number;
}

// Tipado de los datos que envías (usuario/pass)
interface LoginVariables {
  email: string;
  pass: string; // o password
}

export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser); // Acción de Zustand

  return useMutation({
    mutationFn: async ({ email, pass }: LoginVariables) => {
      // Llamada al endpoint de login
      const { data } = await client.post<LoginResponse>("/auth/login", {
        email,
        password: pass,
      });
      return data;
    },
    onSuccess: async (data) => {
      // 1. Guardar los tokens en el almacenamiento seguro
      await tokenStorage.setTokens(data.accessToken, data.refreshToken);
      const profileResponse = await client.get<UserProfile>("/users/profile");
      setUser(profileResponse.data);
      console.log("Usuario cargado:", profileResponse.data.userName);

      // 3. Redirigir a la App
      router.replace("/(app)/home");
    },
    onError: (error) => {
      console.error("Error en login:", error);
      alert("Credenciales incorrectas");
    },
  });
};
