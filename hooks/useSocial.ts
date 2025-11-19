// src/hooks/useSocial.ts
import { useMutation } from "@tanstack/react-query";
import { useEventsStore } from "./../store/useEventStore";
import client from "./../utils/client";

export const useToggleLike = () => {
  // Importamos la acción del store (que ya tienes creada)
  const toggleLikeStore = useEventsStore((state) => state.toggleLike);

  return useMutation({
    // 1. La función que llama a tu API
    mutationFn: async (eventId: string) => {
      // Ajusta a .post o .patch según tu backend
      // La URL ya incluye el ID, no necesitas mandar body
      const response = await client.post(`/events/${eventId}/likes/toggle`);
      return response.data;
    },

    // 2. Optimistic Update (Se ejecuta ANTES de la API)
    onMutate: (eventId) => {
      // Cambiamos la UI inmediatamente para que se sienta instantáneo
      toggleLikeStore(eventId);
    },

    // 3. Manejo de Errores (Rollback)
    onError: (error, eventId) => {
      console.error("Error al dar like:", error);
      // Si falló, revertimos el cambio (haciendo toggle de nuevo)
      toggleLikeStore(eventId);
      // Opcional: Mostrar un toast/alerta
    },
  });
};
