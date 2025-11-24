// hooks/useRegister.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { RegisterPayload } from "./../types/User";
import client from "./../utils/client"; // Tu cliente Axios

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      // POST a http://localhost:3000/api/v1/auth/sign-up
      const { data } = await client.post("/auth/sign-up", payload);
      return data; // La API suele devolver el user creado o un mensaje de éxito
    },
    onSuccess: () => {
      // 1. Mostrar mensaje de éxito
      console.log("Registro exitoso. Redirigiendo a Login.");

      // 2. Redirigir al usuario al Login para que ingrese con su nueva cuenta
      router.replace("/login");
    },
    onError: (error) => {
      console.error("Error durante el registro:", error);
      // Aquí manejarías errores específicos de validación (email ya existe, etc.)
      alert("Error en el registro. Verifica los datos.");
    },
  });
};
