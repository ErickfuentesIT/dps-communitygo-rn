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

export const useToggleBookmark = () => {
  // La acción de Zustand que actualiza la UI
  const toggleBookmarkStore = useEventsStore((state) => state.toggleBookmark);

  return useMutation({
    mutationFn: async (eventId: string) => {
      // EP: http://localhost:3000/api/v1/events/ID/bookmarks/toggle
      await client.post(`/events/${eventId}/bookmarks/toggle`);
    },

    onMutate: (eventId) => {
      // 1. Actualización Optimista (Flip el estado local)
      toggleBookmarkStore(eventId);
    },

    onError: (error, eventId) => {
      // 2. Si falla la API, revertimos el cambio (toggle de nuevo)
      console.error("Error al guardar/marcar:", error);
      toggleBookmarkStore(eventId);
    },
  });
};
export const useToggleAttendance = () => {
  // Importamos la acción que creaste en el Store para flipar el estado local
  const toggleAttendanceStore = useEventsStore(
    (state) => state.toggleAttendance
  );

  return useMutation({
    mutationFn: async (eventId: string) => {
      // 1. Llamada a la API (Endpoint confirmado como POST)
      await client.post(`/events/${eventId}/attendances/toggle`);
    },

    onMutate: (eventId) => {
      // 2. Actualización Optimista: Cambia la UI inmediatamente
      toggleAttendanceStore(eventId);
    },

    onError: (error, eventId) => {
      // 3. Rollback: Si falla la API, revertimos la UI
      console.error("Error al marcar asistencia:", error);
      toggleAttendanceStore(eventId);
      // Puedes mostrar un mensaje de error aquí
    },
  });
};
